class Template {
    constructor(templateId, templateName, templateOwner, description=null, picture=null, file) {
        this.templateId = templateId;
        this.templateName = templateName;
        this.templateOwner = templateOwner;
        this.description = description;
        this.picture = picture;
        this.file = file;
    }
}

export default Template;