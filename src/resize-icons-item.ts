import {PluginValue, ViewUpdate} from "@codemirror/view";
import MDText from "./md-text";

export default class ResizeIconsItem implements PluginValue {
	rightResizeIconClassName = "right-resize-icon-class-name image-tools-resize-item image-tools-resize-item-right"
	leftResizeIconClassName = "left-resize-icon-class-name image-tools-resize-item image-tools-resize-item-left"
	viewUpdate: ViewUpdate
	mdText: MDText

	update(update: ViewUpdate) {
		this.viewUpdate = update
		this.mdText = new MDText(update.state.doc.toString())
		const images = update.view.dom.getElementsByClassName("image-embed")

		Array.from(images).forEach(img => {
			const imageSource = (img.children[0]?.parentNode as HTMLElement | null)?.getAttribute("src")
			if (!imageSource || !this.mdText.hasImage(imageSource)) {
				return
			}

			const classes = Array.from(img.children).map(x => x.className)
			if (img.children[0].tagName === "IMG" && !(classes.includes(this.rightResizeIconClassName))) {
				this.addRightResizeIcon(img.children[0])
			}
		})

		Array.from(images).forEach(img => {
			const imageSource = (img.children[0]?.parentNode as HTMLElement | null)?.getAttribute("src")
			if (!imageSource || !this.mdText.hasImage(imageSource)) {
				return
			}

			const classes = Array.from(img.children).map(x => x.className)
			if (img.children[0].tagName === "IMG" && !(classes.includes(this.leftResizeIconClassName))) {
				this.addLeftResizeIcon(img.children[0])
			}
		})
	}

	addRightResizeIcon(item: any) {
		const icon = document.createElement("div")
		icon.className = this.rightResizeIconClassName

		icon.addEventListener("mousedown", (e) => {
			const startX = e.clientX;

			let startWidth = 0
			if (document.defaultView) {
				startWidth = parseInt(document?.defaultView?.getComputedStyle(item).width, 10);
			}

			const mousemove = (e: any) => {
				const newWidth = startWidth + e.clientX - startX
				this.setNewWidthForImage(item, newWidth)
				item.setAttribute("width", `${newWidth}px`)
			}

			const mouseup = (e: any) => {
				document.documentElement.removeEventListener('mousemove', mousemove, false);
				document.documentElement.removeEventListener('mouseup', mouseup, false);
			}

			document.documentElement.addEventListener('mousemove', mousemove, false);
			document.documentElement.addEventListener('mouseup', mouseup, false);
		})

		item.parentNode?.append(icon)
	}

	addLeftResizeIcon(item: any) {
		const icon = document.createElement("div")
		icon.className = this.leftResizeIconClassName

		icon.addEventListener("mousedown", (e) => {
			const startX = e.clientX;

			let startWidth = 0
			if (document.defaultView) {
				startWidth = parseInt(document?.defaultView?.getComputedStyle(item).width, 10);
			}

			const mousemove = (e: any) => {
				const newWidth = startWidth - e.clientX + startX
				this.setNewWidthForImage(item, newWidth)
				item.setAttribute("width", `${newWidth}px`)
			}

			const mouseup = (e: any) => {
				document.documentElement.removeEventListener('mousemove', mousemove, false);
				document.documentElement.removeEventListener('mouseup', mouseup, false);
			}

			document.documentElement.addEventListener('mousemove', mousemove, false);
			document.documentElement.addEventListener('mouseup', mouseup, false);
		})

		item.parentNode?.append(icon)
	}

	setNewWidthForImage(img: any, newWidth: number) {
		const imgName = img.parentNode.getAttribute("src")
		let imageText = this.mdText.getImageText(imgName)
		let [indexStart, indexEnd] = this.mdText.getImageIndexes(imgName)
		imageText.setWidth(newWidth.toString())

		const changes = this.viewUpdate.state.update({
			changes: {from: indexStart, to: indexEnd, insert: imageText.getImageText()}
		})
		this.viewUpdate.view.dispatch(changes)
	}
}
