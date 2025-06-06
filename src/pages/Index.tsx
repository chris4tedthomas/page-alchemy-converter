import { useState } from "react";
import { ArrowRight, Code, FileCheck, FileUp, Link, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ConversionSteps from "@/components/ConversionSteps";
import AppHeader from "@/components/AppHeader";
import ResultsView from "@/components/ResultsView";
import { convertElementorContent, convertGHLContent, parseHtmlContent } from "@/lib/converters";

type ConversionStatus = "idle" | "converting" | "success" | "error";

const Index = () => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [convertedHtml, setConvertedHtml] = useState("");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleConversion = async (type: "url" | "file") => {
    // Validate inputs
    if (type === "url" && !url.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a valid URL to convert.",
        variant: "destructive",
      });
      return;
    }

    if (type === "file" && !file) {
      toast({
        title: "Missing File",
        description: "Please upload a file to convert.",
        variant: "destructive",
      });
      return;
    }

    // Start conversion process
    setStatus("converting");
    
    try {
      let htmlContent = "";
      
      if (type === "url") {
        try {
          console.log("Fetching URL:", url);
          // Try multiple CORS proxy services in sequence
          const proxies = [
            `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`,
            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`
          ];
          
          let lastError = null;
          for (const proxyUrl of proxies) {
            try {
              console.log("Trying proxy:", proxyUrl);
              const response = await fetch(proxyUrl);
              
              if (response.ok) {
                htmlContent = await response.text();
                console.log("Successfully fetched content, length:", htmlContent.length);
                break;
              } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }
            } catch (proxyError) {
              console.log("Proxy failed:", proxyError);
              lastError = proxyError;
              continue;
            }
          }
          
          if (!htmlContent) {
            throw new Error("All CORS proxies failed. Please try downloading the page and uploading the HTML file instead.");
          }
        } catch (e) {
          console.error("URL fetch error:", e);
          throw e;
        }
      } else {
        // Read file content
        htmlContent = await readFileAsText(file as File);
      }
      
      // Detect page type and process accordingly
      const pageType = detectPageType(htmlContent);
      console.log("Detected page type:", pageType);
      
      let processedHtml = "";
      
      if (pageType === "elementor") {
        processedHtml = convertElementorContent(htmlContent);
      } else if (pageType === "ghl") {
        processedHtml = convertGHLContent(htmlContent);
      } else {
        // Generic HTML cleaning
        processedHtml = parseHtmlContent(htmlContent);
      }
      
      setConvertedHtml(processedHtml);
      setStatus("success");
      
      toast({
        title: "Conversion Complete",
        description: "Your page has been successfully converted to clean HTML!",
      });
    } catch (error) {
      console.error("Conversion error:", error);
      setStatus("error");
      
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during conversion.",
        variant: "destructive",
      });
    }
  };
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };
  
  const detectPageType = (htmlContent: string): "elementor" | "ghl" | "generic" => {
    if (htmlContent.includes("elementor") || 
        htmlContent.includes("wp-content")) {
      return "elementor";
    } else if (htmlContent.includes("gohighlevel") || 
               htmlContent.includes("ghl.page")) {
      return "ghl";
    } else {
      return "generic";
    }
  };

  const resetConverter = () => {
    setUrl("");
    setFile(null);
    setFileName("");
    setStatus("idle");
    setConvertedHtml("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <AppHeader />
      
      <main className="container px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {status === "success" ? (
            <ResultsView html={convertedHtml} onReset={resetConverter} />
          ) : (
            <>
              <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  Page Alchemy Converter
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Transform your WordPress Elementor and GHL pages into clean, optimized HTML code for Keap.
                </p>
              </div>

              <div className="mb-12">
                <ConversionSteps />
              </div>

              <Card className="border-2 border-border/50 shadow-md">
                <CardContent className="p-6">
                  <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger value="url">
                        <Link className="mr-2 h-4 w-4" />
                        URL
                      </TabsTrigger>
                      <TabsTrigger value="file">
                        <FileUp className="mr-2 h-4 w-4" />
                        File Upload
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="url">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="url" className="text-sm font-medium block mb-2">
                            Enter page URL
                          </label>
                          <div className="flex space-x-2">
                            <Input 
                              id="url"
                              placeholder="https://taxauctionsresearch.com"
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                              disabled={status === "converting"}
                              className="flex-grow"
                            />
                            <Button 
                              onClick={() => handleConversion("url")}
                              disabled={status === "converting" || !url.trim()}
                            >
                              {status === "converting" ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Converting
                                </>
                              ) : (
                                <>
                                  Convert
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="file">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="file" className="text-sm font-medium block mb-2">
                            Upload page file (.html, .xml)
                          </label>
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-center w-full">
                              <label 
                                htmlFor="file-upload" 
                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                                  fileName ? "border-brand-500 bg-brand-50/30" : "border-border hover:bg-muted/50"
                                }`}
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  {fileName ? (
                                    <>
                                      <FileCheck className="w-8 h-8 text-brand-600 mb-2" />
                                      <p className="text-sm text-center">
                                        <span className="font-semibold">{fileName}</span>
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <FileUp className="w-8 h-8 text-muted-foreground mb-2" />
                                      <p className="mb-2 text-sm text-muted-foreground">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        HTML, XML (Max 10MB)
                                      </p>
                                    </>
                                  )}
                                </div>
                                <input 
                                  id="file-upload" 
                                  type="file" 
                                  className="hidden" 
                                  accept=".html,.xml"
                                  onChange={handleFileChange}
                                  disabled={status === "converting"}
                                />
                              </label>
                            </div>
                            <Button 
                              onClick={() => handleConversion("file")}
                              disabled={status === "converting" || !file}
                              className="w-full"
                            >
                              {status === "converting" ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Converting
                                </>
                              ) : (
                                <>
                                  Convert File
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      
      <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Page Alchemy Converter. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
