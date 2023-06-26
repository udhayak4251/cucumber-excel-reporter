export type CucumberJsonType = Root2[]

export interface Root2 {
  description: string
  elements: Element[]
  id: string
  keyword: string
  line: number
  name: string
  tags: any[]
  uri: string
}

export interface Element {
  id: string
  keyword: string
  line: number
  name: string
  steps: Step[]
  tags: Tag[]
  type: string
}

export interface Step {
  arguments: Argument[]
  keyword: string
  result: Result
  hidden?: boolean
  match: Match
  name?: string
  line?: number
  embeddings?: Embedding[]
}

export interface Argument {
  line?: number
  content?: string
  rows?: Row[]
}

export interface Row {
  cells: string[]
}

export interface Result {
  status: string
  duration: number
}

export interface Match {
  location: string
}

export interface Embedding {
  data: string
  media: Media
}

export interface Media {
  type: string
}

export interface Tag {
  name: string
  line: number
}
