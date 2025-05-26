import { ArrowRight } from "lucide-react";

const GetStarted: React.FC = () => {

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
      <a href="#" className="btn btn-primary py-3 px-6 text-base">
        Register
      </a>
      <a href="#" className="btn btn-outline py-3 px-6 text-base group">
        <span>Sign In</span>
        <ArrowRight
          size={16}
          className="ml-2 group-hover:translate-x-1 transition-transform"
        />
      </a>
    </div>
  );
};
export default GetStarted;
