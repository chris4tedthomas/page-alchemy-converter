
import { FileUp, Code, ArrowRight, CheckCircle } from "lucide-react";

const ConversionSteps = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="relative flex-1 flex flex-col items-center text-center p-4">
        <div className="bg-brand-100 text-brand-700 rounded-full p-3 mb-3">
          <FileUp className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium mb-1">Input</h3>
        <p className="text-sm text-muted-foreground">Upload your Elementor or GHL page</p>
        <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      
      <div className="relative flex-1 flex flex-col items-center text-center p-4">
        <div className="bg-teal-100 text-teal-700 rounded-full p-3 mb-3">
          <Code className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium mb-1">Convert</h3>
        <p className="text-sm text-muted-foreground">Our system optimizes the HTML</p>
        <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center text-center p-4">
        <div className="bg-brand-100 text-brand-700 rounded-full p-3 mb-3">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium mb-1">Result</h3>
        <p className="text-sm text-muted-foreground">Get clean HTML for Keap</p>
      </div>
    </div>
  );
};

export default ConversionSteps;
