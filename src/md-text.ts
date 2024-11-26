import ImageText from "./image-text";

export default class MDText {
	text: string

	constructor(text: string) {
		this.text = text
	}

	getImageIndexes(imgText: string) {
		console.log("getImageIndexes", imgText)
		if (this.isLocalImage(imgText)) {
			console.log("isLocalImage")
			return this.getLocalImageIndexes(imgText)
		}

		if (this.isUrlImage(imgText)) {
			console.log("isUrlImage")
			return this.getUrlImageIndexes(imgText)
		}

		console.log("[0, 0]")
		return [0, 0]
	}

	isLocalImage(imgText: string) {
		return this.text.indexOf(`![[${imgText}`) !== -1
	}

	isUrlImage(imgText: string) {
		const regex = new RegExp(`!\\[.+\\]\\(${imgText}\\)`)
		const match = this.text.match(regex)
		return !!match
	}

	getLocalImageIndexes(imgText: string) {
		const indexStart = this.text.indexOf(`![[${imgText}`)
		let indexEnd = indexStart
		for (let i = indexStart + 1; i < this.text.length; i++) {
			if (this.text[i] === "]" && this.text[i+1] === "]") {
				indexEnd = i + 2
				break
			}
		}
		return [indexStart, indexEnd]
	}	

	getUrlImageIndexes(imgText: string) {
		const regex = new RegExp(`!\\[.+\\]\\(${imgText}\\)`)
		const match = this.text.match(regex)
		
		if (match && match.index !== undefined) {
			return [match.index, match.index + match[0].length]
		}

		return [0, 0]
	}

	getImageText(imgText: string) {
		console.log("getImageText", imgText)
		const [indexStart, indexEnd] = this.getImageIndexes(imgText)
		console.log("getImageText", [indexStart, indexEnd])
		return new ImageText(this.text.slice(indexStart, indexEnd))
	}
}
