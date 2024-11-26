import {PluginValue, ViewUpdate} from "@codemirror/view";
import {setIcon} from "obsidian";

export default class CopyImageItem implements PluginValue {
	copyImageClassName = "copy-icon-container image-tools-icons-container image-tools-copy-icon"
	viewUpdate: ViewUpdate

	update(update: ViewUpdate) {
		this.viewUpdate = update
		const images = update.view.dom.getElementsByClassName("image-embed")

		Array.from(images).forEach(img => {
			const classes = Array.from(img.children).map(x => x.className)
			if (img.children[0].tagName === "IMG" && !(classes.includes(this.copyImageClassName))) {
				this.addCopyImageIcon(img.children[0])
			}
		})
	}

	addCopyImageIcon(item: any) {
		const iconsContainer = document.createElement("div")
		iconsContainer.className = this.copyImageClassName

		iconsContainer.append(this.createIconElement(
			() => this.copyImage(item.src)
		))

		item.parentNode?.append(iconsContainer)
	}

	createIconElement(clickEvent: any) {
		const icon = document.createElement("div")
		setIcon(icon, "copy")
		icon.className = 'image-tools-icon';
		icon.addEventListener("click", clickEvent)
		return icon
	}

	async copyImage(src: string) {
		const response = await fetch(src)
		let blob = await response.blob()
		blob = await this.convertBlobToPng(blob)
		await this.copyBlobToClipboard(blob)
	}

	async copyBlobToClipboard(blob: Blob): Promise<void> {
		const items = { [blob.type]: blob } as unknown as Record<
			string,
			ClipboardItemData
		>

		const clipboardItem = new ClipboardItem(items)
		await navigator.clipboard.write([clipboardItem])
	}

	async convertBlobToPng(imageBlob: Blob): Promise<Blob> {
		const imageSource = URL.createObjectURL(imageBlob)
		const imageElement = await this.createImageElement(imageSource)
		return await this.getBlobFromImageElement(imageElement)
	}

	async createImageElement(imageSource: string,): Promise<HTMLImageElement> {
		return new Promise(function (resolve, reject) {
			const imageElement = document.createElement('img')
			imageElement.crossOrigin = 'anonymous'
			imageElement.src = imageSource

			imageElement.onload = function (event) {
				const target = event.target as HTMLImageElement
				resolve(target)
			}

			imageElement.onabort = reject
			imageElement.onerror = reject
		})
	}

	async getBlobFromImageElement(
		imageElement: HTMLImageElement,
	): Promise<Blob> {
		return new Promise(function (resolve, reject) {
			const canvas = document.createElement('canvas')
			const context = canvas.getContext('2d')

			if (context) {
				const { width, height } = imageElement
				canvas.width = width
				canvas.height = height
				context.drawImage(imageElement, 0, 0, width, height)

				canvas.toBlob(
					function (blob) {
						if (blob) resolve(blob)
						else reject('Cannot get blob from image element')
					},
					'image/png',
					1,
				)
			}
		})
	}
}
