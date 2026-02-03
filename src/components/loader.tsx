import ClipLoader from "react-spinners/ClipLoader";

interface LoadingScreenProps {
  theme?: string;
  message?: string;
}

const LoadingScreen = ({ theme = "light", message = "Loading..." }: LoadingScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-md">
      <div className="relative">
       
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
        
       
        <ClipLoader 
          color={theme === "dark" ? "#ffffff" : "#3b82f6"} 
          size={60} 
          speedMultiplier={0.8}
        />
      </div>
      
      <p className="mt-6 text-slate-700 dark:text-slate-300 font-medium text-lg animate-pulse">
        {message}
      </p>
      
    
      <div className="flex gap-1 mt-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;