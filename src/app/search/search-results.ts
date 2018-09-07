export class SearchResults {
    constructor(
        public results: SearchResult[],
        public numPages: number,
        public currentPage: number,
        public status: SearchStatus
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

export enum SearchStatus {
    emptyResults = "EMPTY_RESULTS",
    resultsLoading = "RESULTS_LOADING",
    resultsPresent = "RESULTS_PRESENT"
}
