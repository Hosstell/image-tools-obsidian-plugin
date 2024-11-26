import {PluginValue, ViewUpdate} from "@codemirror/view";
import MDText from "./md-text";

export default class ImageUrlHandler implements PluginValue {
    flag = false

    update(update: ViewUpdate) {
        if (this.flag) {
            return
        }

		const mainContainer = update.view.dom.getElementsByClassName('cm-content')[0];
		Array.from(mainContainer.children).forEach((child: any) => {
            if (child.tagName !== "IMG") {
                return
            }
			
            const wrapper = document.createElement("div")
            wrapper.className = "internal-embed media-embed image-embed is-loaded image-tools-image-url"
            child.parentNode.insertAfter(wrapper, child)

            const imgInWrapper = document.createElement("img")
            imgInWrapper.src = child.src
            wrapper.append(imgInWrapper)
            child.remove()
		})
	}
}