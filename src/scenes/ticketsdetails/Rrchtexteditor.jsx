import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import ListItem from '@tiptap/extension-list-item'
import { Button, Box } from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListNumbered,
  FormatListBulleted,
  InsertPhoto,
  Link as LinkIcon,
  Undo,
  Redo,
  Code,
  FormatQuote,
  FormatStrikethrough,
  HorizontalRule
} from '@mui/icons-material'

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <Box sx={{
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
    }}>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        p: 1,
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f8f9fa'
      }}>
        {/* Text formatting */}
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          color={editor.isActive('bold') ? 'primary' : 'inherit'}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <FormatBold fontSize="small" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          color={editor.isActive('italic') ? 'primary' : 'inherit'}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <FormatItalic fontSize="small" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          color={editor.isActive('underline') ? 'primary' : 'inherit'}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <FormatUnderlined fontSize="small" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          color={editor.isActive('strike') ? 'primary' : 'inherit'}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <FormatStrikethrough fontSize="small" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          color={editor.isActive('code') ? 'primary' : 'inherit'}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <Code fontSize="small" />
        </Button>

        {/* Lists */}
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive('bulletList') ? 'primary' : 'inherit'}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <FormatListBulleted fontSize="small" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive('orderedList') ? 'primary' : 'inherit'}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <FormatListNumbered fontSize="small" />
        </Button>

        {/* Block elements */}
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          color={editor.isActive('blockquote') ? 'primary' : 'inherit'}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <FormatQuote fontSize="small" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <HorizontalRule fontSize="small" />
        </Button>

        {/* Links and images */}
        <Button
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href
            const url = window.prompt('URL', previousUrl)

            if (url === null) return
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
              return
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
          }}
          color={editor.isActive('link') ? 'primary' : 'inherit'}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <LinkIcon fontSize="small" />
        </Button>
        <Button
          onClick={() => {
            const url = window.prompt('Enter the URL of the image:')
            if (url) editor.chain().focus().setImage({ src: url }).run()
          }}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <InsertPhoto fontSize="small" />
        </Button>

        {/* Undo/redo */}
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <Undo fontSize="small" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <Redo fontSize="small" />
        </Button>
      </Box>

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <Box sx={{
            display: 'flex',
            backgroundColor: '#ffffff',
            borderRadius: 1,
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            p: '2px'
          }}>
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              color={editor.isActive('bold') ? 'primary' : 'inherit'}
              size="small"
              sx={{ minWidth: 'auto' }}
            >
              <FormatBold fontSize="small" />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              color={editor.isActive('italic') ? 'primary' : 'inherit'}
              size="small"
              sx={{ minWidth: 'auto' }}
            >
              <FormatItalic fontSize="small" />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              color={editor.isActive('underline') ? 'primary' : 'inherit'}
              size="small"
              sx={{ minWidth: 'auto' }}
            >
              <FormatUnderlined fontSize="small" />
            </Button>
            <Button
              onClick={() => {
                const previousUrl = editor.getAttributes('link').href
                const url = window.prompt('URL', previousUrl)
                if (url === null) return
                if (url === '') {
                  editor.chain().focus().extendMarkRange('link').unsetLink().run()
                  return
                }
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
              }}
              color={editor.isActive('link') ? 'primary' : 'inherit'}
              size="small"
              sx={{ minWidth: 'auto' }}
            >
              <LinkIcon fontSize="small" />
            </Button>
          </Box>
        </BubbleMenu>
      )}

      <EditorContent
        editor={editor}
        style={{
          padding: '16px',
          minHeight: '150px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}
      />
    </Box>
  )
}

export default RichTextEditor