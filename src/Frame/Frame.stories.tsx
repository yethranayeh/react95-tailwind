import React from 'react';
import { Frame } from './Frame';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: '5rem',
      background: 'var(--t-material)'
    }}
  >
    <div id='default-buttons'>
      {/* Note: This ID was used in the original for styling buttons,
          which will be handled by the Button component later */}
      {children}
    </div>
  </div>
);

export default {
  title: 'Layout/Frame',
  component: Frame,
  decorators: [(story: () => React.ReactNode) => <Wrapper>{story()}</Wrapper>]
};

export function Default() {
  return (
    <Frame
      variant='outside'
      shadow
      style={{ padding: '0.5rem', lineHeight: '1.5', width: 600 }}
    >
      <p style={{ padding: '0.5rem' }}>
        This is a frame of the &apos;window&apos; variant, the default. Notice
        the subtle difference in borders. The lightest border is not on the edge
        of this frame.
      </p>
      <Frame variant='inside' style={{ margin: '1rem', padding: '1rem' }}>
        This frame of the &apos;button&apos; variant on the other hand has the
        lightest border on the edge. Use this frame inside &apos;window&apos;
        frames.
        <br />
        <Frame
          variant='field'
          style={{
            marginTop: '1rem',
            padding: '1rem',
            height: 200,
            width: 100
          }}
        >
          A field frame variant is used to display content.
        </Frame>
      </Frame>
      <Frame
        variant='well'
        style={{ marginTop: '1rem', padding: '0.1rem 0.25rem', width: '100%' }}
      >
        The &apos;status&apos; variant of a frame is often used as a status bar
        at the end of the window.
      </Frame>
    </Frame>
  );
}

Default.story = {
  name: 'default'
};
