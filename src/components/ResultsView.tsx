
import { useState } from "react";
import { ArrowLeft, Check, Code, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResultsViewProps {
  html: string;
  onReset: () => void;
}

const ResultsView = ({ html, onReset }: ResultsViewProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: "HTML code has been copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted-page.html";
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Your HTML file has been downloaded.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Conversion Successful!</h2>
          <p className="text-muted-foreground">
            Your page has been converted to clean, optimized HTML code.
          </p>
        </div>
        <Button variant="outline" onClick={onReset}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Convert Another
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Tabs defaultValue="code">
          <div className="bg-muted p-3 border-b">
            <TabsList>
              <TabsTrigger value="code">
                <Code className="mr-2 h-4 w-4" />
                HTML Code
              </TabsTrigger>
              <TabsTrigger value="preview">
                Preview
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto"></div>
          </div>
          
          <TabsContent value="code" className="m-0">
            <div className="relative">
              <div className="absolute right-3 top-3 flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 gap-1"
                  onClick={handleCopyCode}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              <pre className="p-4 pt-12 bg-muted/50 overflow-x-auto font-mono text-sm">
                <code>{html}</code>
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="m-0">
            <div className="border-t bg-background h-[500px] overflow-auto">
              <iframe
                srcDoc={html}
                title="Converted Page Preview"
                className="w-full h-full"
                sandbox="allow-same-origin"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-muted/50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">Next Steps</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="h-5 w-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
                <span className="text-xs">1</span>
              </div>
            </div>
            <span>Copy the HTML code or download the file</span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="h-5 w-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
                <span className="text-xs">2</span>
              </div>
            </div>
            <span>Open the Keap page builder</span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="h-5 w-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
                <span className="text-xs">3</span>
              </div>
            </div>
            <span>Paste the HTML code into Keap's HTML editor</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsView;
