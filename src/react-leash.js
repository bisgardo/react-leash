import React, {createElement} from 'react'

const snap = (min, val, max) => {
	if (val < min) return min
	if (val > max) return max
	return val
}

export const withOffset = WrappedComponent =>
	class extends React.Component {
		constructor(props) {
			super(props)

			this.handleScroll = this.handleScroll.bind(this)
			this.parentRef = this.parentRef.bind(this)
			this.childRef = this.childRef.bind(this)

			this.state = {left: 0, top: 0}

			this.parent = null
			this.child = null
		}

		componentDidMount() {
			window.addEventListener('scroll', this.handleScroll);
			this.handleScroll()
		}

		componentWillUnmount() {
			window.removeEventListener('scroll', this.handleScroll);
		}

		handleScroll() {
			const {parent, child} = this

			if (!parent) {
				throw new Error('No parent registered')
			}
			if (!child) {
				throw new Error('No child registered')
			}

			const parentStyle = window.getComputedStyle(parent)
			const parentWidth = parseInt(parentStyle.getPropertyValue('width'), 10) || 0
			const parentHeight = parseInt(parentStyle.getPropertyValue('height'), 10) || 0

			const childRect = child.getBoundingClientRect()
			const childLeft = childRect.left
			const childTop = childRect.top

			const childStyle = window.getComputedStyle(child)
			const childMarginTop = parseInt(childStyle.getPropertyValue('margin-top'), 10) || 0
			const childMarginRight = parseInt(childStyle.getPropertyValue('margin-right'), 10) || 0
			const childMarginBottom = parseInt(childStyle.getPropertyValue('margin-bottom'), 10) || 0
			const childMarginLeft = parseInt(childStyle.getPropertyValue('margin-left'), 10) || 0

			const childWidth = childRect.width + childMarginTop + childMarginBottom
			const childHeight = childRect.height + childMarginRight + childMarginLeft
			
			const maxLeft = parentWidth - childWidth
			const maxTop = parentHeight - childHeight

			this.setState(state => ({
				left: snap(0, state.left - childLeft, maxLeft),
				top: snap(0, state.top - childTop, maxTop),
			}))
		}

		parentRef(parent) {
			this.parent = parent
		}

		childRef(child) {
			this.child = child
		}

		render() {
			const {props, state, parentRef, childRef} = this
			const {children} = props
			const {left, top} = state
			return createElement(
				WrappedComponent,
				{
					left,
					top,
					refs: {parentRef: parentRef, childRef: childRef},
					transform: `translateX(${left}px) translateY(${top}px)`
				},
				children
			)
		}
	}

export const OffsetIntoViewport = withOffset(
	({refs, left, top, transform, children}) => children({refs, left, top, transform})
)
