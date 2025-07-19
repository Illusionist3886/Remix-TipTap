import './css/styles.scss'

import { TextStyleKit } from '@tiptap/extension-text-style'
import { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import {
  TextBoldIcon,
  TextItalicIcon,
} from '@shopify/polaris-icons'

import {ButtonGroup, Button} from '@shopify/polaris';


const extensions = [TextStyleKit, StarterKit]

function MenuBar({ editor }) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive('bold'),
        canBold: ctx.editor.can().chain().focus().toggleBold().run(),
        isItalic: ctx.editor.isActive('italic'),
        canItalic: ctx.editor.can().chain().focus().toggleItalic().run(),
        isStrike: ctx.editor.isActive('strike'),
        canStrike: ctx.editor.can().chain().focus().toggleStrike().run(),
        isCode: ctx.editor.isActive('code'),
        canCode: ctx.editor.can().chain().focus().toggleCode().run(),
        canClearMarks: ctx.editor.can().chain().focus().unsetAllMarks().run(),
        isParagraph: ctx.editor.isActive('paragraph'),
        isHeading1: ctx.editor.isActive('heading', { level: 1 }),
        isHeading2: ctx.editor.isActive('heading', { level: 2 }),
        isHeading3: ctx.editor.isActive('heading', { level: 3 }),
        isHeading4: ctx.editor.isActive('heading', { level: 4 }),
        isHeading5: ctx.editor.isActive('heading', { level: 5 }),
        isHeading6: ctx.editor.isActive('heading', { level: 6 }),
        isBulletList: ctx.editor.isActive('bulletList'),
        isOrderedList: ctx.editor.isActive('orderedList'),
        isCodeBlock: ctx.editor.isActive('codeBlock'),
        isBlockquote: ctx.editor.isActive('blockquote'),
        canUndo: ctx.editor.can().chain().focus().undo().run(),
        canRedo: ctx.editor.can().chain().focus().redo().run(),
      }
    },
  })

  return (
      <ButtonGroup variant="segmented">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? 'w-6 h-6 is-active' : 'w-6 h-6'}
          title="Bold"
        >
          <TextBoldIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? 'w-6 h-6 is-active' : 'w-6 h-6'}
          title="Italic"
        >
          <TextItalicIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? 'is-active' : ''}
          title="Strikethrough"
        >
          S
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? 'is-active' : ''}
          title="Inline Code"
        >
          C
        </Button>
        <Button 
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="Clear Formatting"
        >
          x
        </Button>
        <Button 
          onClick={() => editor.chain().focus().clearNodes().run()}
          title="Clear Nodes"
        >
          x
        </Button>
        <Button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState.isParagraph ? 'is-active' : ''}
          title="Paragraph"
        >
          P
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editorState.isHeading1 ? 'is-active' : ''}
          title="Heading 1"
        >
          H1
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editorState.isHeading2 ? 'is-active' : ''}
          title="Heading 2"
        >
          H2
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editorState.isHeading3 ? 'is-active' : ''}
          title="Heading 3"
        >
          H3
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editorState.isHeading4 ? 'is-active' : ''}
          title="Heading 4"
        >
          H4
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editorState.isHeading5 ? 'is-active' : ''}
          title="Heading 5"
        >
          H5
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editorState.isHeading6 ? 'is-active' : ''}
          title="Heading 6"
        >
          H6
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? 'is-active' : ''}
          title="Bullet List"
        >
          B
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? 'is-active' : ''}
          title="Numbered List"
        >
          N
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? 'is-active' : ''}
          title="Code Block"
        >
          ""
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? 'is-active' : ''}
          title="Blockquote"
        >
          ""
        </Button>
        <Button 
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          |
        </Button>
        <Button 
          onClick={() => editor.chain().focus().setHardBreak().run()}
          title="Line Break"
        >
          L
        </Button>
        <Button 
          onClick={() => editor.chain().focus().undo().run()} 
          disabled={!editorState.canUndo}
          title="Undo"
        >
          U
        </Button>
        <Button 
          onClick={() => editor.chain().focus().redo().run()} 
          disabled={!editorState.canRedo}
          title="Redo"
        >
          R
        </Button>
      </ButtonGroup>
    )
}

export default function TipTap () {
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content: `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That's a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
</p>
<blockquote>
  Wow, that's amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`,
  })
  return (
    <div>
      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}