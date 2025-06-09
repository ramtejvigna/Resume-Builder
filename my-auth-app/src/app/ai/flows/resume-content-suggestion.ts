'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered content suggestions to improve resumes.
 *
 * - ResumeContentSuggestionInput: The input type for the resume content suggestion flow.
 * - ResumeContentSuggestionOutput: The output type for the resume content suggestion flow.
 * - resumeContentSuggestion: An async function that takes ResumeContentSuggestionInput and returns a Promise of ResumeContentSuggestionOutput.
 */

import { ai } from '@/app/ai/genkit';
import { z } from 'genkit';

const ResumeContentSuggestionInputSchema = z.object({
    resumeContent: z
        .string()
        .describe('The content of the resume to be improved.'),
    jobDescription: z
        .string()
        .optional()
        .describe('The job description for the target job, to tailor the resume to.'),
});
export type ResumeContentSuggestionInput = z.infer<
    typeof ResumeContentSuggestionInputSchema
>;

const ResumeContentSuggestionOutputSchema = z.object({
    improvedContent: z
        .string()
        .describe('The improved content of the resume with AI suggestions.'),
});
export type ResumeContentSuggestionOutput = z.infer<
    typeof ResumeContentSuggestionOutputSchema
>;

export async function resumeContentSuggestion(
    input: ResumeContentSuggestionInput
): Promise<ResumeContentSuggestionOutput> {
    return resumeContentSuggestionFlow(input);
}

const resumeContentSuggestionPrompt = ai.definePrompt({
    name: 'resumeContentSuggestionPrompt',
    input: { schema: ResumeContentSuggestionInputSchema },
    output: { schema: ResumeContentSuggestionOutputSchema },
    prompt: `You are an AI resume expert. Review the following resume content and provide suggestions to improve it.

Resume Content:
{{resumeContent}}

{{#if jobDescription}}
Here is the job description for the target job. Tailor the resume to this job description.
Job Description:
{{jobDescription}}
{{/if}}

Provide the improved content. Focus on improving clarity, impact, and relevance to the target job description if provided. Be concise.`,
});

const resumeContentSuggestionFlow = ai.defineFlow(
    {
        name: 'resumeContentSuggestionFlow',
        inputSchema: ResumeContentSuggestionInputSchema,
        outputSchema: ResumeContentSuggestionOutputSchema,
    },
    async input => {
        const { output } = await resumeContentSuggestionPrompt(input);
        return output!;
    }
);
