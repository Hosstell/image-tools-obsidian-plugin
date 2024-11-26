import {PluginValue, ViewUpdate} from "@codemirror/view";
import MDText from "./md-text";

export default class ImageUrlHandler implements PluginValue {
    flag = false

    update(update: ViewUpdate) {
        if (this.flag) {
            return
        }

		const mainContainer = update.view.dom.getElementsByClassName('cm-content')[0];
        const images = mainContainer.getElementsByTagName("img")

		Array.from(images).forEach((image: any) => {
            if (image.parentNode.className.includes("image-embed") || image.parentNode.tagName === 'DIALOG') {
                return
            }
			
            const wrapper = document.createElement("div")
            wrapper.className = "internal-embed media-embed image-embed is-loaded image-tools-image-url"
            wrapper.setAttribute("src", image.src)
            image.parentNode.insertAfter(wrapper, image)
            wrapper.append(image)
		})
	}
}