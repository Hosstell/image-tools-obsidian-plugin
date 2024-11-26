import {PluginValue, ViewUpdate} from "@codemirror/view";
import MDText from "./md-text";
import {setIcon} from "obsidian";

export default class AlignIconsItem implements PluginValue {
	alignIconsClassName = "align-icons-class-name image-tools-icons-container image-tools-icons-container-right"
	viewUpdate: ViewUpdate
	mdText: MDText

	update(update: ViewUpdate) {
		this.viewUpdate = update
		this.mdText = new MDText(update.state.doc.toString())
		const imageContainerDivs = update.view.dom.getElementsByClassName("image-embed")
		
		Array.from(imageContainerDivs).forEach((imageContainerDiv: any) => {
			const img = imageContainerDiv.children[0]
			
			const classes = Array.from(imageContainerDiv.children).map((x: any) => x.className)
			if (imageContainerDiv.children[0].tagName === "IMG" && !(classes.includes(this.alignIconsClassName))) {
				this.addAlignIcons(img)
			}

			if (!imageContainerDiv.className.includes("images-tools-text-align-")) {
				const textAlignClassName = "images-tools-text-align-" + this.mdText.getImageText(img.getAttribute("src")).align
				imageContainerDiv.classList.add(textAlignClassName)
			}
		})
	}

	addAlignIcons(img: any) {
		const imgParent = img.parentNode

		const iconsContainer = document.createElement("div")
		iconsContainer.className = this.alignIconsClassName

		iconsContainer.append(this.createIconElement(
			"align-left",
			() => {
				this.setNewAlignForImage(img, "left")
				imgParent.classList.remove("images-tools-text-align-right")
				imgParent.classList.remove("images-tools-text-align-center")
				imgParent.classList.add("images-tools-text-align-left")
			}
		))
		iconsContainer.append(this.createIconElement(
			"align-center",
			() => {
				this.setNewAlignForImage(img, "center")
				imgParent.classList.remove("images-tools-text-align-right")
				imgParent.classList.remove("images-tools-text-align-left")
				imgParent.classList.add("images-tools-text-align-center")
			}
		))
		iconsContainer.append(this.createIconElement(
			"align-right",
			() => {
				this.setNewAlignForImage(img, "right")
				imgParent.classList.remove("images-tools-text-align-center")
				imgParent.classList.remove("images-tools-text-align-left")
				imgParent.classList.add("images-tools-text-align-right")
			}
		))

		imgParent.append(iconsContainer)
	}

	createIconElement(iconId: string, clickEvent: any) {
		const icon = document.createElement("div")
		setIcon(icon, iconId)
		icon.className = 'image-tools-icon';
		icon.addEventListener("click", clickEvent)
		return icon
	}

	setNewAlignForImage(img: any, newAlign: string) {
		const imgName = img.parentNode.parentNode.getAttribute("src")
		let imageText = this.mdText.getImageText(imgName)
		let [indexStart, indexEnd] = this.mdText.getImageIndexes(imgName)
		imageText.setAlign(newAlign)

		const changes = this.viewUpdate.state.update({
			changes: {from: indexStart, to: indexEnd, insert: imageText.getImageText()}
		})
		this.viewUpdate.view.dispatch(changes)
	}
}
