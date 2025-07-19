import './css/styles.scss'

import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import HardBreak from '@tiptap/extension-hard-break'
import Link from '@tiptap/extension-link'

import { TextBoldIcon, TextItalicIcon } from '@shopify/polaris-icons'
import { ButtonGroup, Button } from '@shopify/polaris'

// === MenuBar Component ===
function MenuBar({ editor, viewSource, toggleView }) {
  const [editorState, setEditorState] = useState({})

  useEffect(() => {
    if (!editor) return

    const updateState = () => {
      setEditorState({
        isBold: editor.isActive('bold'),
        isItalic: editor.isActive('italic'),
        isStrike: editor.isActive('strike'),
        isCode: editor.isActive('code'),
        isParagraph: editor.isActive('paragraph'),
        isHeading1: editor.isActive('heading', { level: 1 }),
        isHeading2: editor.isActive('heading', { level: 2 }),
        isHeading3: editor.isActive('heading', { level: 3 }),
        isHeading4: editor.isActive('heading', { level: 4 }),
        isHeading5: editor.isActive('heading', { level: 5 }),
        isHeading6: editor.isActive('heading', { level: 6 }),
        isBulletList: editor.isActive('bulletList'),
        isOrderedList: editor.isActive('orderedList'),
        isCodeBlock: editor.isActive('codeBlock'),
        isBlockquote: editor.isActive('blockquote'),
        canUndo: editor.can().chain().focus().undo().run(),
        canRedo: editor.can().chain().focus().redo().run(),
        canBold: editor.can().chain().focus().toggleBold().run(),
        canItalic: editor.can().chain().focus().toggleItalic().run(),
        canStrike: editor.can().chain().focus().toggleStrike().run(),
        canCode: editor.can().chain().focus().toggleCode().run(),
      })
    }

    updateState()
    editor.on('update', updateState)

    return () => {
      editor.off('update', updateState)
    }
  }, [editor])

  if (!editor) return null

  return (
    <ButtonGroup variant="segmented">
      <Button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editorState.canBold}>
        <TextBoldIcon />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editorState.canItalic}>
        <TextItalicIcon />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editorState.canStrike}>S</Button>
      <Button onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editorState.canCode}>C</Button>
      <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear Marks</Button>
      <Button onClick={() => editor.chain().focus().clearNodes().run()}>Clear Nodes</Button>

      <Button onClick={() => editor.chain().focus().setParagraph().run()} className={editorState.isParagraph ? 'is-active' : ''}>P</Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editorState.isHeading1 ? 'is-active' : ''}>H1</Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editorState.isHeading2 ? 'is-active' : ''}>H2</Button>
      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editorState.isBulletList ? 'is-active' : ''}>B</Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editorState.isOrderedList ? 'is-active' : ''}>N</Button>
      <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editorState.isCodeBlock ? 'is-active' : ''}>&lt;/&gt;</Button>
      <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editorState.isBlockquote ? 'is-active' : ''}>&ldquo;&rdquo;</Button>
      <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</Button>
      <Button onClick={() => editor.chain().focus().setHardBreak().run()}>↵</Button>
      <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo}>Undo</Button>
      <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo}>Redo</Button>
      <Button onClick={toggleView} size="slim">
        {viewSource ? 'Switch to Editor Mode' : 'View Source Code'}
      </Button>
    </ButtonGroup>
  )
}

// === TipTap Component ===
export default function TipTap() {
  const [viewSource, setViewSource] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false,
        link: false,
      }),
      TextStyleKit,
      Image,
      HardBreak,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: '',
          class: 'custom-link',
          style: 'color: blue; text-decoration: underline;',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    immediatelyRender: false,
    content: `
      <h2>Hi there,</h2>
      <p>This is <strong>Tiptap</strong>. Enjoy!</p>
    `,
    onUpdate: ({ editor }) => {
      if (viewSource) {
        setHtmlContent(editor.getHTML())
      }
    },
  })

  const toggleView = () => {
    if (!editor) return

    if (!viewSource) {
      setHtmlContent(editor.getHTML())
    } else {
      editor.commands.setContent(htmlContent)
    }

    setViewSource(!viewSource)
  }

  return (
    <div style={{ padding: '20px' }}>
      {editor && <MenuBar editor={editor} viewSource={viewSource} toggleView={toggleView} />}

      <div style={{ marginTop: '16px', marginBottom: '8px' }} />

      {viewSource ? (
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          style={{
            width: '100%',
            height: '300px',
            fontFamily: 'monospace',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '4px',
          }}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  )
}
