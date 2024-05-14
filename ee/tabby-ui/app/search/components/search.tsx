'use client'

import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { IconBlocks } from "@/components/ui/icons"
import { CodeBlock } from '@/components/ui/codeblock'

import { MemoizedReactMarkdown } from '@/components/markdown'

interface Source {
  url: string;
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
  }]
}]

export default function Search () {
  // FIXME: the height considering demo banner
  return (
    <div>
      <Header />
      <ScrollArea>
        <div className="h-screen mx-auto max-w-lg md:max-w-5xl px-0 md:px-6">
          <div className="">
            {mockData.map(data => (
              <QuestionAnswerPair
                key={data.question}
                question={data.question}
                answer={data.answer}
                sources={data.sources}
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
  sources
}: {
  question: string;
  answer: string;
  sources: Source[]
}) {
  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-tight first:mt-0">
        {question}
      </h3>

      <div className="flex items-center gap-x-2">
        <IconBlocks />
        <p>Source</p>
      </div>
      <div className="grid grid-cols-2 gap-sm md:grid-cols-4">
        {sources.map(source => (
          <SourceCard key={source.url} source={source} />
        ))}
      </div>
      

      <div className="flex items-center gap-x-2">
        <IconBlocks />
        <p>Answer</p>
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

      <div className="flex items-center gap-x-2">
        <IconBlocks />
        <p>Related</p>
      </div>
    </div>
  )
}

function SourceCard ({source}: {source: Source}) {
  const { hostname } = new URL(source.url);
  return (
    <Alert className="flex">
      <img
        src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${hostname}`}
        alt='hostname'
        className="h-4 w-4 mr-1.5" />
      <div>
        <AlertTitle>{source.title}</AlertTitle>
        <AlertDescription>{source.url}</AlertDescription>
      </div>
    </Alert>
  )
}
