import React from 'react';
import { IntlProvider } from 'react-intl-next';
import Editor, { EditorProps } from './editor/editor-core/src/editor';
import EditorContext from './editor/editor-core/src/ui/EditorContext';
import WithEditorActions from './editor/editor-core/src/ui/WithEditorActions';
import CollapsedEditor from './editor/editor-core/src/ui/CollapsedEditor';
import ToolbarHelp from './editor/editor-core/src/ui/ToolbarHelp';
import {
  currentUser,
  getEmojiProvider,
} from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { mediaProvider } from './editor/editor-core/examples/5-full-page';
import { MockActivityResource } from './editor/editor-core/example-helpers/activity-provider';

export type Props = {
  editorProps?: EditorProps;
  replacementDoc?: any;
};

export type State = {
  isExpanded?: boolean;
  defaultValue?: Node | string | Object;
};

export class CommentEditorJiraBento extends React.Component<Props, State> {
  state = {
    isExpanded: false,
    defaultValue: '',
  };

  private providers = {
    emojiProvider: getEmojiProvider({
      uploadSupported: true,
      currentUser,
    }),
    mentionProvider: Promise.resolve(mentionResourceProvider),
    activityProvider: Promise.resolve(new MockActivityResource()),
  };

  onChange = (actions: any) => () => {
    actions.getValue().then((value: any) => {
      this.setState({ defaultValue: value });
    });
  };

  onFocus = () =>
    this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));

  render() {
    return (
      <IntlProvider locale="en">
        <EditorContext>
          <WithEditorActions
            render={(actions) => (
              <CollapsedEditor
                isExpanded={this.state.isExpanded}
                onFocus={this.onFocus}
                placeholder="Add a comment..."
              >
                <Editor
                  appearance="comment"
                  defaultValue={this.state.defaultValue}
                  shouldFocus={true}
                  disabled={false}
                  onCancel={() => this.setState({ isExpanded: false })}
                  onChange={this.onChange(actions)}
                  onSave={() => this.setState({ isExpanded: false })}
                  {...this.providers}
                  media={{
                    provider: mediaProvider,
                    allowMediaSingle: true,
                  }}
                  allowRule={true}
                  allowTextColor={true}
                  allowTables={{
                    allowControls: true,
                  }}
                  allowPanel={true}
                  allowHelpDialog={true}
                  placeholder="We support markdown! Try **bold**, `inline code`, or ``` for code blocks."
                  primaryToolbarComponents={[
                    <ToolbarHelp titlePosition="top" title="Help" key="help" />,
                  ]}
                />
              </CollapsedEditor>
            )}
          />
        </EditorContext>
      </IntlProvider>
    );
  }
}

export default function CommentExample(props?: Props) {
  return <CommentEditorJiraBento {...props} />;
}
