class Project {
  constructor(
    ownerName,
    ownerId,
    ownerNickname,
    ownerEmail,
    projectTemplate,
    projectId,
    projectTitle,
    description,
    startDate,
    endDate,
    category = null,
    usedLanguage = null,
    projectLink = null,
    solving = null,
    challenge = null,
    video = null,
    coverImage = null,
    images = [],
    logo = null,
    share = false,
    hits = 0,
    likes = [],
    contacts = [],
    comments = []
  ) {
    this.ownerName = ownerName;
    this.ownerId = ownerId;
    this.ownerNickname = ownerNickname;
    this.ownerEmail = ownerEmail;
    this.projectTemplate = projectTemplate;
    this.projectId = projectId;
    this.projectTitle = projectTitle;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.category = category;
    this.usedLanguage = usedLanguage;
    this.projectLink = projectLink;
    this.solving = solving;
    this.challenge = challenge;

    this.video = video;
    this.coverImage = coverImage;
    this.images = images;
    this.logo = logo;
    this.share = share;
    this.hits = hits;
    this.likes = likes;
    this.contacts = contacts;
    this.comments = comments;
  }
}

export default Project;
