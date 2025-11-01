import type { Handler } from '@netlify/functions';
import * as fs from 'fs';
import * as path from 'path';

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse multipart form data
    const boundary = event.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'No boundary found in Content-Type header' }),
      };
    }

    // Parse the body
    const body = Buffer.from(event.body || '', event.isBase64Encoded ? 'base64' : 'utf8');
    const parts = body.toString().split(`--${boundary}`);
    
    let fileData: Buffer | null = null;
    let fileName = '';
    let fileType = '';

    for (const part of parts) {
      if (part.includes('Content-Disposition')) {
        const nameMatch = part.match(/name="([^"]+)"/);
        const filenameMatch = part.match(/filename="([^"]+)"/);
        const contentTypeMatch = part.match(/Content-Type:\s*([^\r\n]+)/);

        if (filenameMatch && nameMatch?.[1] === 'file') {
          fileName = filenameMatch[1];
          fileType = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';
          
          // Extract file content (after the headers, before the next boundary)
          // Find the double CRLF that separates headers from content
          const headerEndIndex = part.indexOf('\r\n\r\n');
          if (headerEndIndex !== -1) {
            let contentStart = headerEndIndex + 4;
            // Find where content ends (before next boundary or end)
            let contentEnd = part.indexOf('\r\n--', contentStart);
            if (contentEnd === -1) {
              contentEnd = part.length;
            }
            // Remove trailing CRLF if present
            if (part[contentEnd - 2] === '\r' && part[contentEnd - 1] === '\n') {
              contentEnd -= 2;
            }
            const fileContent = part.substring(contentStart, contentEnd);
            fileData = Buffer.from(fileContent, 'binary');
          }
        }
      }
    }

    if (!fileData || !fileName) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'No file found in request' }),
      };
    }

    // Create unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const fileExt = path.extname(fileName);
    const baseName = path.basename(fileName, fileExt).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueFileName = `${timestamp}-${randomId}-${baseName}${fileExt}`;

    // Create enterprisefiles directory in public if it doesn't exist
    // Note: In Netlify production, we can't write to public directly
    // This will work in local development
    // For production, consider using Netlify Blobs or another storage solution
    const publicDir = path.join(process.cwd(), 'public', 'enterprisefiles');
    
    // In Netlify production, use /tmp for temporary storage
    // But files won't persist - this is a limitation
    const uploadDir = process.env.NETLIFY ? 
      path.join('/tmp', 'enterprisefiles') : 
      publicDir;

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write file
    const filePath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(filePath, fileData);

    // Return relative path from public directory
    // In production on Netlify, you'll need to serve files differently
    // For now, return a path that will be served statically if files are in public
    const relativePath = `/enterprisefiles/${uniqueFileName}`;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        path: relativePath,
        fileName: uniqueFileName,
        originalFileName: fileName,
      }),
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

