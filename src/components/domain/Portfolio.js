class Portfolio {
  constructor(
    portfolioId,
    ownerName,
    ownerId,
    ownerEamil,
    portfolioName,
    projects,
    usedLanguage,
    frontend,
    backend,
    share
  ) {
    this.portfolioId = portfolioId; // 포트폴리오 ID
    this.ownerName = ownerName; //소유자 이름
    this.ownerId = ownerId; // 소유자 ID
    this.ownerEmail = ownerEamil;
    this.portfolioName = portfolioName; // 포트폴리오 이름
    this.projects = projects; // 포함된 프로젝트들
    this.usedLanguage = usedLanguage; // 사용 언어
    this.frontend = frontend;
    this.backend = backend;
    this.share = share; // 공유 여부
  }
}

export default Portfolio;
