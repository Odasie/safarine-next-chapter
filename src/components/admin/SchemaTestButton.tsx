import { Button } from "@/components/ui/button";
import { PlayCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { validateSupabaseSchema } from "@/utils/supabaseSchemaTest";

export const SchemaTestButton = () => {
  const [testing, setTesting] = useState(false);

  const runSchemaTest = async () => {
    setTesting(true);
    try {
      console.log('🧪 Running comprehensive schema test...');
      const result = await validateSupabaseSchema();
      
      if (result.success) {
        toast.success(result.message || 'Schema validation passed!');
        console.log('✅ Schema test result:', result);
      } else {
        toast.error(result.message || 'Schema validation failed');
        console.error('❌ Schema test failed:', result);
      }
    } catch (error) {
      console.error('❌ Schema test error:', error);
      toast.error('Schema test failed with unexpected error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={runSchemaTest}
      disabled={testing}
      className="flex items-center gap-2"
    >
      {testing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Testing...
        </>
      ) : (
        <>
          <PlayCircle className="w-4 h-4" />
          Test Schema
        </>
      )}
    </Button>
  );
};