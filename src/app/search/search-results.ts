export class SearchResults {
    constructor(
        public results: SearchResult[],
        public numPages: number,
        public currentPage: number
    ) {}
}

export class SearchResult {
    constructor(
        public htmlTitle: string,
        public htmlSnippet: string,
        public link: string,
        public displayLink: string
    ) {}
}
