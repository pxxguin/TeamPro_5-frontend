class Hackathon {
    constructor(
        hackId,
        hackName,
        startDate,
        endDate,
        link,
        maxMemNumber,
        description,
        video = null,
        pictures = [],
        coverImage = null,
        logo = null,
        part,
        ownerId, 
        ownerEmail,
        participant = []
    ) {
        this.hackId = hackId;
        this.hackName = hackName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.link = link;
        this.maxMemNumber = maxMemNumber;
        this.description = description;
        this.video = video;
        this.pictures = pictures;
        this.coverImage = coverImage;
        this.logo = logo;
        this.part = part;
        this.ownerId = ownerId; 
        this.ownerEmail = ownerEmail;
        this.participant = Array.isArray(participant) ? participant : [];
    }

}

export default Hackathon;
