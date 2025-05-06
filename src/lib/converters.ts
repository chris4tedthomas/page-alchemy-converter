import DOMPurify from 'dompurify';

/**
 * Parses and cleans basic HTML content
 */
export function parseHtmlContent(htmlContent: string): string {
  try {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    
    // Extract the main content
    const body = doc.body;
    
    // Remove unnecessary scripts
    const scripts = body.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Remove tracking pixels, analytics tags
    const trackingElements = body.querySelectorAll('iframe[src*="google"], iframe[src*="facebook"], img[src*="analytics"]');
    trackingElements.forEach(el => el.remove());
    
    // Generate a clean HTML structure
    const cleanHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title || "Converted Page"}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    ${extractCriticalCSS(doc)}
  </style>
</head>
<body>
  <div class="container">
    ${DOMPurify.sanitize(body.innerHTML)}
  </div>
</body>
</html>`;
    
    return cleanHTML;
  } catch (error) {
    console.error("Error parsing HTML:", error);
    throw new Error("Failed to parse HTML content");
  }
}

/**
 * Processes WordPress Elementor pages
 */
export function convertElementorContent(htmlContent: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    
    // Extract Elementor content sections
    let mainContent = "";
    
    // Find Elementor sections
    const elementorSections = doc.querySelectorAll(".elementor-section, .elementor-container");
    
    if (elementorSections.length > 0) {
      // Process Elementor sections
      elementorSections.forEach(section => {
        // Clean up Elementor-specific attributes and classes
        section.removeAttribute("data-elementor-type");
        section.removeAttribute("data-elementor-id");
        
        // Keep the content but simplify the structure
        mainContent += section.outerHTML;
      });
    } else {
      // Fallback to regular content
      const contentElements = doc.querySelectorAll("main, #content, .content, article");
      contentElements.forEach(element => {
        mainContent += element.outerHTML;
      });
    }
    
    // If no content was found, use the body content
    if (!mainContent.trim()) {
      mainContent = doc.body.innerHTML;
    }
    
    // Generate clean HTML with extracted content
    const cleanHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title || "Converted Elementor Page"}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    ${extractCriticalCSS(doc)}
  </style>
</head>
<body>
  <div class="container">
    ${DOMPurify.sanitize(mainContent)}
  </div>
</body>
</html>`;
    
    return cleanHTML;
  } catch (error) {
    console.error("Error converting Elementor content:", error);
    throw new Error("Failed to convert Elementor page");
  }
}

/**
 * Processes GoHighLevel (GHL) pages
 */
export function convertGHLContent(htmlContent: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    
    // Extract GHL content sections
    let mainContent = "";
    
    // Look for GHL specific containers
    const ghlSections = doc.querySelectorAll(".section, .block, .container, [data-type='section']");
    
    if (ghlSections.length > 0) {
      // Process GHL sections
      ghlSections.forEach(section => {
        // Clean up GHL-specific attributes
        section.removeAttribute("data-block-id");
        section.removeAttribute("data-block-type");
        
        // Keep the content but simplify the structure
        mainContent += section.outerHTML;
      });
    } else {
      // Fallback to regular content
      const contentElements = doc.querySelectorAll("main, #content, .content, .page-content");
      contentElements.forEach(element => {
        mainContent += element.outerHTML;
      });
    }
    
    // If no content was found, use the body content
    if (!mainContent.trim()) {
      mainContent = doc.body.innerHTML;
    }
    
    // Generate clean HTML with extracted content
    const cleanHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title || "Converted GHL Page"}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    ${extractCriticalCSS(doc)}
  </style>
</head>
<body>
  <div class="container">
    ${DOMPurify.sanitize(mainContent)}
  </div>
</body>
</html>`;
    
    return cleanHTML;
  } catch (error) {
    console.error("Error converting GHL content:", error);
    throw new Error("Failed to convert GHL page");
  }
}

/**
 * Extracts critical CSS from a document
 */
function extractCriticalCSS(doc: Document): string {
  let criticalCSS = "";
  
  // Extract inline styles
  const styleElements = doc.querySelectorAll("style");
  styleElements.forEach(style => {
    if (style.textContent) {
      criticalCSS += style.textContent + "\n";
    }
  });
  
  // Add basic responsive styles
  criticalCSS += `
    /* Responsive styles */
    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }
    }
    
    /* Image optimization */
    img {
      max-width: 100%;
      height: auto;
    }
    
    /* Form styles */
    input, textarea, select, button {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      box-sizing: border-box;
    }
    
    /* Button styles */
    .btn, button, [type="submit"] {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4a6bdf;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      font-weight: bold;
    }
    
    .btn:hover, button:hover, [type="submit"]:hover {
      background-color: #3a55b4;
    }
  `;
  
  return criticalCSS;
}
