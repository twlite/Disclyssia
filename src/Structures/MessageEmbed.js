'use strict';

module.exports = class EmbedBuilder {
    /**
     * @constructor
     */
    constructor() {
        this.setup({});
    }

    setup(data) {
        this.rich = data.embed = {
            title: null,
            author: null,
            color: null,
            description: null,
            thumbnail: null,
            fields: [],
            image: null,
            footer: null,
            timestamp: null,
        };
    }

    /**
     * Sets the title of the embed.
     * @param {string} title The title
     * @returns {EmbedBuilder} This Embed
     */
    setTitle(title) {
        if (!title) { throw new Error('You must provide a title to set a title!'); }
        if (title.length > 256) { throw new Error('You must provide a title with 256 characters max.!'); }
        this.rich.title = title;
        return this;
    }

    /**
     * Sets the description of the embed.
     * @param {string} description The description
     * @returns {EmbedBuilder} This Embed
     */
    setDescription(description) {
        if (!description) { throw new Error('You must provide a description to set a description!'); }
        if (description.length > 2048) { throw new Error('You must provide a description with 2048 characters max.!'); }
        this.rich.description = description;
        return this;
    }

    /**
     * Sets the image of the embed.
     * @param {string} imageURL The URL of the image
     * @returns {EmbedBuilder} This Embed
     */
    setImage(imageURL) {
        if (!imageURL) { throw new Error('You must provide a imageURL to set an image!'); }
        this.rich.image = {
            url: imageURL
        };
        return this;
    }

    /**
     * Sets the thumbnail of the embed.
     * @param {string} imageURL The URL of the thumbnail
     * @returns {EmbedBuilder} This Embed
     */
    setThumbnail(imageURL) {
        if (!imageURL) { throw new Error('You must provide a text to set a footer!'); }
        this.rich.thumbnail = {
            url: imageURL
        };
        return this;
    }

    /**
     * Sets the footer of the embed.
     * @param {string} text The text of the footer
     * @param {string} iconURL The icon URL of the footer
     * @returns {EmbedBuilder} This Embed
     */
    setFooter(text, iconURL) {
        if (!text) { throw new Error('You must provide a text to set a footer!'); }
        if (text.length > 2048) { throw new Error('You must provide a text of a footer with 2048 characters max.!'); }
        if (!iconURL) { throw new Error('You must provide a iconURL to set a footer!'); }
        this.rich.footer = {
            text: text,
            icon_url: iconURL
        };
        return this;
    }

    /**
     * Sets the timestamp of the embed.
     * @returns {EmbedBuilder} This Embed
     */
    setTimestamp() {
        this.rich.timestamp = new Date();
        return this;
    }

    /**
     * Sets the author of the embed.
     * @param {string} name The name of the author
     * @param {string} iconURL The icon URL of the author
     * @returns {EmbedBuilder} This Embed
     */
    setAuthor(name, iconURL) {
        if (!name) { throw new Error('You must provide a name to set an author!'); }
        if (name.length > 256) { throw new Error('You must provide an author with 256 characters max.!'); }
        if (!iconURL) { throw new Error('You must provide a iconURL to set a author!'); }
        this.rich.author = {
            name: name,
            icon_url: iconURL
        };
        return this;
    }

    /**
     * Sets the color of the embed.
     * @param {ColorResolvable} color The color of the embed
     * @returns {EmbedBuilder} This Embed
     */
    setColor(color) {
        if (!color) { throw new Error('You must provide a color to set a color!'); }
        this.rich.color = color;
        return this;
    }

    /**
     * Adds a field to the embed.
     * @param {string} name The name of the field
     * @param {string} value The value of the field
     * @param {boolean} [inline=false] Set the field to display inline
     * @returns {EmbedBuilder} This Embed
     */
    addField(name, value, inline = false) {
        if (!name) { throw new Error('You must provide a name to add a field!'); }
        if (name.length > 256) { throw new Error('You must provide a name of a field with 256 characters max.!'); }
        if (!value) { throw new Error('You must provide a value to add a field!'); }
        if (value.length > 1024) { throw new Error('You must provide a value of a field with 1024 characters max.!'); }
        if (this.rich.fields.length > 25) { throw new Error('You can include 25 fields max.!'); }
        this.rich.fields.push({
            name,
            value,
            inline: inline ? true : false
        });
        return this;
    }
};
