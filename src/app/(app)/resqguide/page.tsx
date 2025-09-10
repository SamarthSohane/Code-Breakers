import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { guides } from '@/lib/data';

export default function ResQGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">ResQGuide</h1>
        <p className="mt-3 text-lg text-muted-foreground">Your essential resource for happy and healthy pets.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {guides.map((guide, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold font-headline">{guide.title}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {guide.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
