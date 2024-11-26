export default class ImageText {
	img: string | undefined
	align: string | undefined
	width: string | undefined
	type: "local" | "url"
	name: string | undefined

	constructor(text: string) {
		if (text.startsWith("![[")) {
			this.parseLocalImage(text)
		} else {
			this.parseUrlImage(text)
		}
	}

	parseLocalImage(text: string) {
		this.type = "local"
		const params = text.slice(3, text.length-2).split("|")
		this.img = params[0]

		if (params.length == 3) {
			this.align = params[1]
			this.width = params[2]
			return
		}

		if (params.length == 2) {
			if (params[1] == "left" || params[1] == "center" || params[1] == "right") {
				this.align = params[1]
			} else {
				this.width = params[1]
			}
		}
	}

	parseUrlImage(text: string) {
		this.type = "url"
		const prefix = text.split("]")[0].split("[")[1]
		const params = prefix.split("|")
		this.name = params[0]

		if (params.length == 3) {
			this.align = params[1]
			this.width = params[2]
		}

		if (params.length == 2) {
			if (params[1] == "left" || params[1] == "center" || params[1] == "right") {
				this.align = params[1]
			} else {
				this.width = params[1]
			}
		}

		this.img = text.split("(")[1].split(")")[0]
	}

	getImageText() {
		return this.type === "local" ? this.getLocalImageText() : this.getUrlImageText()
	}

	getLocalImageText() {
		let output = this.img
		if (this.align !== undefined) {
			output += "|" + this.align
		}
		if (this.width !== undefined) {
			output += "|" + this.width
		}
		return `![[${output}]]`
	}

	getUrlImageText() {
		let prefix = this.name
		if (this.align !== undefined) {
			prefix += "|" + this.align
		}
		if (this.width !== undefined) {
			prefix += "|" + this.width
		}
		console.log(this.img)
		return `![${prefix}](${this.img})`
	}

	setWidth(newWidth: string) {
		this.width = newWidth
	}

	setAlign(newAlign: string) {
		this.align = newAlign
	}
}
