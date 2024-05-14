'use client'

import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { ScrollArea } from "@radix-ui/react-scroll-area"
import { IconBlocks, IconLayers, IconSparkles, IconPlus } from "@/components/ui/icons"
import { CodeBlock } from '@/components/ui/codeblock'

import { MemoizedReactMarkdown } from '@/components/markdown'

interface Source {
  url: string;
  title: string
}

interface Related {
  title: string
}

const mockData = [{
  question: "write a triangle with CSS",
  answer: "The 'hubspot-api' library is not a preloaded package in HubSpot. Instead, you should use the '@hubspot/api-client' package. Here is an example of how to include it:\n\n```javascript\nconst hubspot = require('@hubspot/api-client');\nconst hubspotClient = new hubspot.Client({ apiKey: YOUR_API_KEY });\n```\n\nYou can find more information about the package in the [NPM reference](https://www.npmjs.com/package/@hubspot/api-client) and the [HubSpot Serverless Reference](https://developers.hubspot.com/docs/cms/data/serverless-functions/reference#preloaded-packages).",
  sources: [{
    url: 'https://github.com/TabbyML/tabby/blob/main/clients/vscode/src/TabbyCompletionProvider.ts#L43-L58',
    title: 'tabby/clients/vscode/src/TabbyCompletionProvider.ts'
  }, {
    url: 'https://github.com/TabbyML/tabby/issues/2083',
    title: 'Run chat in command line'
  }, {
    url: 'https://gitlab.com/gitlab-org/gitlab/-/blob/master/ee/db/embedding/structure.sql',
    title: 'ee/db/embedding/structure.sql'
  }],
  related: [{
    title: 'What are the key differences between safetensor and GGUF formats?'
  }, {
    title: 'Can you provide more detail on the tools and dependencies needed for converting a safetensor model to GGUF?'
  }, {
    title: 'What are the benefits of converting a safetensor model to GGUF format?'
  }]
}]

export default function Search () {
  // FIXME: the height considering demo banner
  return (
    <div>
      <Header />
      <ScrollArea>
        <div className="h-screen mx-auto max-w-lg md:max-w-4xl px-0 md:px-6">
          <div className="">
            {mockData.map(data => (
              <QuestionAnswerPair
                key={data.question}
                question={data.question}
                answer={data.answer}
                sources={data.sources}
                related={data.related}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function Header () {
  return (
    <div></div>
  )
}

function QuestionAnswerPair ({
  question,
  answer,
  sources,
  related
}: {
  question: string;
  answer: string;
  sources: Source[];
  related: Related[]
}) {
  return (
    <div className="py-10">
      <h3 className="text-2xl font-semibold tracking-tight first:mt-0 mb-4">
        {question}
      </h3>

      <div className="flex items-center gap-x-2 mb-1">
        <IconBlocks className="relative" style={{ top: '-0.1rem' }} />
        <p className="text-sm font-bold leading-normal">Source</p>
      </div>
      <div className="grid gap-sm grid-cols-4 gap-x-2">
        {sources.map((source, index) => (
          <SourceCard key={source.url} source={source} index={index+1} />
        ))}
      </div>
      

      <div className="flex items-center gap-x-1.5 mt-6">
        <IconSparkles />
        <p className="text-sm font-bold leading-none">Answer</p>
      </div>
      <MemoizedReactMarkdown
        className="prose prose-full-width break-words dark:prose-invert prose-p:leading-relaxed prose-pre:mt-1 prose-pre:p-0"
        remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
      >
        {answer}
      </MemoizedReactMarkdown>

      <div className="flex items-center gap-x-1.5 mt-6">
        <IconLayers />
        <p className="text-sm font-bold leading-none">Related</p>
      </div>
      <div className="flex flex-col gap-y-3 mt-3">
        {related.map((related, index) => (
          <RealtedCard key={index} related={related} />
        ))}
      </div>

    </div>
  )
}

function SourceCard ({
  source,
  index
}: {
  source: Source;
  index: number
}) {
  const { hostname } = new URL(source.url);
  return (
    <div className="border rounded-lg py-2 px-4 bg-card flex flex-col justify-between">
      <p className="w-full text-ellipsis overflow-hidden text-xs font-semibold line-clamp-2 break-all">{source.title}</p>
      <div className="flex items-center">
        <img
          src={`https://s2.googleusercontent.com/s2/favicons?sz=128&domain_url=${hostname}`}
          alt={hostname}
          className="h-3.5 w-3.5 mr-1 rounded-full" />

        <div className="flex items-center text-xs gap-x-0.5 text-muted-foreground">
          <p className="flex-1 text-ellipsis overflow-hidden">{hostname.split('.')[0]}</p>
          <span className="relative -top-1.5 text-xl">.</span>
          <p>{index}</p>
        </div>
      </div>
    </div>
  )
}

function RealtedCard ({
  related
}: {
  related: Related
}) {
  return (
    <div className="border rounded-lg py-3 p-4 flex items-center justify-between">
      <p className="w-full text-ellipsis overflow-hidden text-sm font-semibold">{related.title}</p>
      <IconPlus />
    </div>
  )
}
