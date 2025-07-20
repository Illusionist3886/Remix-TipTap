import './css/styles.scss'

import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import HardBreak from '@tiptap/extension-hard-break'
import Link from '@tiptap/extension-link'

import { TextBoldIcon, TextItalicIcon, ImageIcon } from '@shopify/polaris-icons'
import { ButtonGroup, Button, Modal, TextField, FormLayout, DropZone, Thumbnail } from '@shopify/polaris'

// === MenuBar Component ===
function MenuBar({ editor, viewSource, toggleView }) {
  const [editorState, setEditorState] = useState({})
  const [linkModalActive, setLinkModalActive] = useState(false)
  const [linkText, setLinkText] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  
  // Image modal state
  const [imageModalActive, setImageModalActive] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageWidth, setImageWidth] = useState('')
  const [imageHeight, setImageHeight] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)

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
        isLink: editor.isActive('link'),
        isImage: editor.isActive('image'),

      })
    }

    updateState()
    editor.on('update', updateState)

    return () => {
      editor.off('update', updateState)
    }
  }, [editor])

  const handleLinkClick = () => {
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)
    
    // Check if we're editing an existing link
    const linkMark = editor.getAttributes('link')
    
    if (editorState.isLink && linkMark.href) {
      // Editing existing link
      setLinkText(selectedText || '')
      setLinkUrl(linkMark.href || '')
    } else {
      // Creating new link
      setLinkText(selectedText || '')
      setLinkUrl('')
    }
    
    setLinkModalActive(true)
  }

  const handleLinkSubmit = () => {
    if (!linkUrl) {
      // Remove link if URL is empty
      editor.chain().focus().unsetLink().run()
    } else {
      // Set or update link
      if (linkText) {
        // If we have link text, replace selection with link
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
      } else {
        // Just set link on current selection
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }
    }
    
    setLinkModalActive(false)
    setLinkText('')
    setLinkUrl('')
  }

  const handleLinkCancel = () => {
    setLinkModalActive(false)
    setLinkText('')
    setLinkUrl('')
  }

  // Image handling functions
  const handleImageClick = () => {
    // Check if we're editing an existing image
    const { from, to } = editor.state.selection
    let imageNode = null

    editor.state.doc.nodesBetween(from, to, (node) => {
      if (node.type.name === 'image') {
        imageNode = node
      }
    })

    if (imageNode && imageNode.attrs?.src) {
      setImageUrl(imageNode.attrs.src || '')
      setImageAlt(imageNode.attrs.alt || '')
      setImageWidth(imageNode.attrs.width || '')
      setImageHeight(imageNode.attrs.height || '')
    } else {
      setImageUrl('')
      setImageAlt('')
      setImageWidth('300')
      setImageHeight('200')
    }

    setImageModalActive(true)
  }

  const handleImageSubmit = () => {
    if (!imageUrl) return
    
    const imageAttrs = {
      src: imageUrl,
      alt: imageAlt || '',
    }
    
    if (imageWidth) imageAttrs.width = imageWidth
    if (imageHeight) imageAttrs.height = imageHeight
    
    if (editorState.isImage) {
      // Update existing image - delete current and insert new with updated attributes
      const { from, to } = editor.state.selection
      editor.chain()
        .focus()
        .deleteRange({ from, to })
        .setImage(imageAttrs)
        .run()
    } else {
      // Insert new image
      editor.chain().focus().setImage(imageAttrs).run()
    }
    
    handleImageCancel()
  }

  const handleImageCancel = () => {
    setImageModalActive(false)
    setImageUrl('')
    setImageAlt('')
    setImageWidth('')
    setImageHeight('')
    setUploadedFiles([])
    setIsUploading(false)
  }

  const uploadImageToAPI = async (blob) => {
    try {
      return 'https://polaris-react.shopify.com/images/shopify-logo.svg'; // dummy
      const formData = new FormData()
      formData.append('image', blob)
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data.url // Assuming API returns { url: 'https://...' }
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }

  const handleFileUpload = async (files) => {
    setIsUploading(true)
    setUploadedFiles(files)
    
    try {
      const file = files[0]
      if (file) {
        // Upload to API and get the returned URL
        const uploadedImageUrl = await uploadImageToAPI(file)
        setImageUrl(uploadedImageUrl)
        
        // Set default alt text based on filename
        const fileName = file.name.split('.')[0]
        setImageAlt(fileName.replace(/[-_]/g, ' '))
      }
    } catch (error) {
      // Handle upload error
      console.error('Failed to upload image:', error)
      // You might want to show an error message to the user
      alert('Failed to upload image. Please try again.')
      setUploadedFiles([])
    } finally {
      setIsUploading(false)
    }
  }

  if (!editor) return null

  const buttonGroup = (
    <ButtonGroup variant="segmented">
      <Button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editorState.canBold}>
        <TextBoldIcon className="w-4 h-4" />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editorState.canItalic}>
        <TextItalicIcon className="w-4 h-4" />
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
      <Button onClick={handleLinkClick} pressed={editorState.isLink}>
        Link
      </Button>
      <Button onClick={handleImageClick} pressed={editorState.isImage}>
        <ImageIcon className="w-4 h-4" />
      </Button>
      <Button onClick={toggleView} size="slim">
        {viewSource ? 'Switch to Editor Mode' : 'View Source Code'}
      </Button>
    </ButtonGroup>
  )

  return (
    <>
      {buttonGroup}
      <Modal
        open={linkModalActive}
        onClose={handleLinkCancel}
        title="Add/Edit Link"
        primaryAction={{
          content: 'Save Link',
          onAction: handleLinkSubmit,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleLinkCancel,
          },
          {
            content: 'Remove Link',
            onAction: () => {
              editor.chain().focus().unsetLink().run()
              handleLinkCancel()
            },
            destructive: true,
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Link Text"
              value={linkText}
              onChange={setLinkText}
              placeholder="Enter link text (optional)"
              helpText="Leave empty to use selected text"
            />
            <TextField
              label="Link URL"
              value={linkUrl}
              onChange={setLinkUrl}
              placeholder="https://example.com"
              type="url"
              required
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
      
      <Modal
        open={imageModalActive}
        onClose={handleImageCancel}
        title="Add/Edit Image"
        primaryAction={{
          content: 'Save Image',
          onAction: handleImageSubmit,
          disabled: !imageUrl,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleImageCancel,
          },
          ...(editorState.isImage ? [{
            content: 'Remove Image',
            onAction: () => {
              editor.chain().focus().deleteSelection().run()
              handleImageCancel()
            },
            destructive: true,
          }] : []),
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <div>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>Upload Image</p>
                <DropZone
                  onDrop={handleFileUpload}
                  accept="image/*"
                  type="image"
                  disabled={isUploading}
                >
                  {uploadedFiles.length > 0 ? (
                    <div>
                      <Thumbnail
                        source={imageUrl}
                        alt={imageAlt || 'Uploaded image'}
                        size="large"
                      />
                      <p>File uploaded successfully!</p>
                    </div>
                  ) : (
                    <DropZone.FileUpload actionTitle="Choose file" actionHint="or drag and drop" />
                  )}
                </DropZone>
              </div>
              
              <TextField
                label="Image URL"
                value={imageUrl}
                onChange={setImageUrl}
                placeholder="https://example.com/image.jpg or upload file above"
                helpText="You can either upload a file or enter an image URL"
              />
              
              <TextField
                label="Alt Text"
                value={imageAlt}
                onChange={setImageAlt}
                placeholder="Describe the image for accessibility"
                helpText="Important for screen readers and SEO"
              />
              
                <TextField
                  label="Width"
                  value={imageWidth}
                  onChange={setImageWidth}
                  placeholder="300"
                  suffix="px"
                  type="number"
                />
                <TextField
                  label="Height"
                  value={imageHeight}
                  onChange={setImageHeight}
                  placeholder="200"
                  suffix="px"
                  type="number"
                />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </>
  )
}

// === TipTap Component ===
export default function TipTap({ content, getUpdatedHtmlContent }) {
  const [viewSource, setViewSource] = useState(false)
  const [htmlContent, setHtmlContent] = useState(content)

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
    content: htmlContent,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML()
      getUpdatedHtmlContent(newContent)
      if (viewSource) {
        setHtmlContent(newContent)
      }
    }
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
