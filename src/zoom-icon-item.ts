import {PluginValue, ViewUpdate} from "@codemirror/view";
import {setIcon} from "obsidian";

export default class ZoomIconItem implements PluginValue {
	zoomIconsClassName = "zoom-icons-class-name image-tools-icons-container image-tools-icons-container-left"
	viewUpdate: ViewUpdate

	update(update: ViewUpdate) {
		this.viewUpdate = update
		const imageContainerDivs = update.view.dom.getElementsByClassName("image-embed")

		Array.from(imageContainerDivs).forEach(imageContainerDiv => {
			const classes = Array.from(imageContainerDiv.children).map((x: any) => x.className)
			if (imageContainerDiv.children[0].tagName === "IMG" && !(classes.includes(this.zoomIconsClassName))) {
				this.addZoomIcon(imageContainerDiv.children[0])
			}
		})
	}

	addZoomIcon(img: any) {
		const imgParent = img.parentNode
		const iconsContainer = document.createElement("div")
		iconsContainer.className = this.zoomIconsClassName

		iconsContainer.append(this.createIconElement(
			() => this.openImageDialog(img, imgParent)
		))
		img.parentNode?.append(iconsContainer)
	}

	createIconElement(clickEvent: any) {
		const icon = document.createElement("div")
		setIcon(icon, "zoom-in")
		icon.className = "image-tools-icon"
		icon.addEventListener("click", clickEvent)
		return icon
	}

	openImageDialog(image: any, parent: any) {
		console.log("openImageDialog")

		const imageContainer = document.createElement("dialog")
		imageContainer.className = "image-tools-image-zoom-container"
		imageContainer.addEventListener("click", imageContainer.remove)

		const img = document.createElement("img")
		img.src = image.src
		img.className = "image-tools-zoom-image"

		imageContainer.append(img)
		parent.append(imageContainer)
		imageContainer.showModal()
	}
}
