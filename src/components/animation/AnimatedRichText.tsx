import { ShuffleText } from "@/components/animation/ShuffleText";
import type { ShuffleEffect6Options } from "@/lib/typeShuffle/types";

export type RichTextBlock = {
  heading?: string;
  paragraphs: string[];
};

type AnimatedRichTextProps = {
  title?: string;
  subtitle?: string;
  blocks: RichTextBlock[];
  effectOptions?: ShuffleEffect6Options;
};

export const AnimatedRichText = ({ title, subtitle, blocks, effectOptions }: AnimatedRichTextProps) => {
  return (
    <div className="space-y-6">
      {title ? (
        <ShuffleText
          as="h1"
          text={title}
          className="text-3xl md:text-5xl font-bold text-primary text-glow font-terminal"
          effectOptions={effectOptions}
        />
      ) : null}

      {subtitle ? (
        <ShuffleText
          as="p"
          text={subtitle}
          className="text-lg text-muted-foreground max-w-3xl"
          effectOptions={effectOptions}
        />
      ) : null}

      {blocks.map((block, index) => (
        <section key={index} className="border border-border bg-card/60 p-6 space-y-4">
          {block.heading ? (
            <ShuffleText
              as="h2"
              text={block.heading}
              className="text-xl md:text-2xl text-secondary font-terminal"
              effectOptions={effectOptions}
            />
          ) : null}

          <div className="space-y-3">
            {block.paragraphs.map((paragraph, paragraphIndex) => (
              <ShuffleText
                key={paragraphIndex}
                as="p"
                text={paragraph}
                className="text-base text-foreground/90 leading-relaxed"
                effectOptions={effectOptions}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
