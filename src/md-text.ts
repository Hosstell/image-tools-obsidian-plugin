import ImageText from "./image-text";

export default class MDText {
	text: string

	constructor(text: string) {
		this.text = text
	}

	getImageIndexes(imgText: string) {
		
		if (this.isLocalImage(imgText)) {
			return this.getLocalImageIndexes(imgText)
		}

		if (this.isUrlImage(imgText)) {
			return this.getUrlImageIndexes(imgText)
		}

		return [0, 0]
	}

	isLocalImage(imgText: string) {
		return this.text.indexOf(`![[${imgText}`) !== -1
	}

	isUrlImage(imgText: string) {
		return this.text.indexOf(`!\[.+\]\(${imgText}\)`) !== -1
	}

	getLocalImageIndexes(imgText: string) {
		

		const indexStart = this.text.indexOf(`![[${imgText}`) + 3
		let indexEnd = indexStart
		for (let i = indexStart + 1; i < this.text.length; i++) {
			if (this.text[i] === "]" && this.text[i+1] === "]") {
				indexEnd = i
				break
			}
		}
		return [indexStart, indexEnd]
	}	

	getUrlImageIndexes(imgText: string) {
		const regex = new RegExp(`!\[.+\]\(${imgText}\)/`)
		const match = this.text.match(regex)
		console.log(match)
		return [0, 0]
	}

	getImageText(imgText: string) {
		const [indexStart, indexEnd] = this.getImageIndexes(imgText)
		return new ImageText(this.text.slice(indexStart, indexEnd))
	}
}
