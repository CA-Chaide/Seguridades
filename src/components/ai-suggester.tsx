'use client';

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getRoleSuggestions } from '@/app/actions';
import { Loader2, Lightbulb, UserCheck, AlertTriangle } from 'lucide-react';

const initialState = {
  success: false,
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
      Get Suggestions
    </Button>
  );
}

export function AiSuggester() {
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    const menuOption = formData.get('menuOption') as string;
    const userWorkflows = formData.get('userWorkflows') as string;
    if (!menuOption || !userWorkflows) {
      return { success: false, error: 'Please fill out all fields.' };
    }
    return getRoleSuggestions({ menuOption, userWorkflows });
  }, initialState);

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Role Suggestion</CardTitle>
          <CardDescription>
            Describe a new menu option and typical user workflows to get AI-powered role suggestions.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="menuOption">Menu Option Name</Label>
              <Input id="menuOption" name="menuOption" placeholder="e.g., 'Export User Data'" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userWorkflows">User Workflows</Label>
              <Textarea
                id="userWorkflows"
                name="userWorkflows"
                placeholder="Describe how users will interact with this feature. For example: 'Support agents need to export user data to handle GDPR requests. Administrators need to audit these exports.'"
                rows={5}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <Card className="flex flex-col min-h-[460px]">
        <CardHeader>
          <CardTitle>Suggestions</CardTitle>
          <CardDescription>The AI will suggest roles and provide its reasoning here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center p-6">
          {useFormStatus().pending && (
             <div className="flex flex-col items-center gap-4 text-muted-foreground animate-fade-in">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Analyzing workflows...</p>
             </div>
          )}
          {!useFormStatus().pending && state.error && (
            <div className="text-destructive flex flex-col items-center gap-2 text-center animate-fade-in">
                <AlertTriangle className="h-8 w-8"/>
                <p className="font-semibold">An error occurred</p>
                <p className="text-sm">{state.error}</p>
            </div>
          )}
          {!useFormStatus().pending && state.success && state.data && (
             <div className="space-y-6 w-full animate-fade-in">
                <div>
                    <h3 className="font-semibold flex items-center mb-2 text-lg">
                        <UserCheck className="mr-2 h-5 w-5 text-accent"/>
                        Suggested Roles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {state.data.suggestedRoles.map(role => (
                            <span key={role} className="bg-accent/20 text-accent-foreground py-1 px-3 rounded-full text-sm font-medium">{role}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold flex items-center mb-2 text-lg">
                        <Lightbulb className="mr-2 h-5 w-5 text-primary"/>
                        Reasoning
                    </h3>
                    <p className="text-sm text-foreground bg-secondary p-4 rounded-lg border">{state.data.reasoning}</p>
                </div>
            </div>
          )}
          {!useFormStatus().pending && !state.data && !state.error && (
             <div className="text-center text-muted-foreground">
                <p>Your suggestions will appear here.</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
