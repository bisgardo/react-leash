# react-leash

A wrapper/higher order component that computes offsets for the wrapped component
to be translated such that it stays within the viewport.
This translation is intended to be performed using the CSS3 `transform` attribute,
which is supported in IE9+, and exposed to the wrapped component.
In case ancient browser support is desired,
the computed offsets can probably be made to work with margins in many cases.

The name of the project comes from the fact that it can make components act as if they are
connected to the viewport with an invisible leash.
The leashed component stays in the viewport as long as it also stays within the boundaries of
its designated parent.

The design is inspired by that of [react-measure](https://github.com/souporserious/react-measure).

As part of making the project,
it was realized that the same functionality can be obtained using `position: sticky`,
which should probably be used instead.
However, as browser support is pretty weak at the time of this writing,
there might still be a place for a project like this
(there is, for instance, no IE support at all).
Also, there may be complex cases that cannot be properly handled by pure CSS.

Other project that (at a quick glance) appears to solve the same problem:

* [react-sticky](https://github.com/captivationsoftware/react-sticky)
* [react-sticky-position](https://github.com/jackmoore/react-sticky-position)
  (uses [sticky-position](https://github.com/jackmoore/sticky-position) polyfill)

## Examples

The "child" component is transformed to stay within the viewport for as long as the 

* Wrapper component: `OffsetIntoViewport`:

      <OffsetIntoViewport>
        {
          ({refs, left, top, transform}) => (
            <div ref={refs.parentRef}>
              <div ref={refs.childRef} style={{transform}}>
                ({left}, {top})
              </div>
            </div>
          )
        }
      </OffsetIntoViewport>
    
* Higher-order component: `withOffset`:

      const OriginalComponent = ({refs, left, top, transform}) => (
        <div ref={refs.parentRef}>
          <div ref={refs.childRef} style={{transform}}>
            ({left}, {top})
          </div>
        </div>
      )
      const LeashedComponent = withOffset(OriginalComponent)
    
      // Later, inside some render method:
    
      <LeashedComponent />

## Status

This project was made in a day, is not very well tested, and hasn't been used in production.
In short, no features should be considered stable.

Also, as this repo was rather carelessly carved out of a bloated setup,
`package.json` is incomplete.

### Known issues

* The used method doesn't work with table headers in IE.
See [jQuery.floatThead](https://mkoryak.github.io/floatThead/) for an alternative/inspiration
(uses fixed positioning and stores width in `colgroup`/`col`).

### Future ideas

* Implement solution where offsets are computed relative to a stationary 0x0 div
  (might reduce the slight "jumpiness" that happens especially in IE).
* Implement alternative solution that uses fixed positioning.
* Implement usage of `position: sticky` if the browser supports it.