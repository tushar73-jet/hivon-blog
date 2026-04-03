'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, Italic, Strikethrough, Code, 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, 
  Undo, Redo, 
} from 'lucide-react';

const MenuButton = ({ onClick, isActive, disabled, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center
      ${isActive ? 'bg-blue-100/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
      disabled:opacity-30 active:scale-90`}
  >
    {children}
  </button>
);

export default function RichTextEditor({ value, onChange, placeholder = "Start writing your article..." }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 text-gray-800 dark:text-gray-200 font-serif leading-relaxed',
        placeholder: placeholder,
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden glass shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <MenuButton 
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')}
        >
          <Bold size={18} />
        </MenuButton>
        <MenuButton 
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')}
        >
          <Italic size={18} />
        </MenuButton>
        <MenuButton 
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          isActive={editor.isActive('strike')}
        >
          <Strikethrough size={18} />
        </MenuButton>
        <MenuButton 
          title="Inline Code"
          onClick={() => editor.chain().focus().toggleCode().run()} 
          isActive={editor.isActive('code')}
        >
          <Code size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

        <MenuButton 
          title="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          isActive={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 size={18} />
        </MenuButton>
        <MenuButton 
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 size={18} />
        </MenuButton>
        <MenuButton 
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          isActive={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

        <MenuButton 
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')}
        >
          <List size={18} />
        </MenuButton>
        <MenuButton 
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')}
        >
          <ListOrdered size={18} />
        </MenuButton>
        <MenuButton 
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive('blockquote')}
        >
          <Quote size={18} />
        </MenuButton>

        <div className="ml-auto flex items-center gap-1">
          <MenuButton 
            title="Undo"
            onClick={() => editor.chain().focus().undo().run()} 
            disabled={!editor.can().undo()}
          >
            <Undo size={18} />
          </MenuButton>
          <MenuButton 
            title="Redo"
            onClick={() => editor.chain().focus().redo().run()} 
            disabled={!editor.can().redo()}
          >
            <Redo size={18} />
          </MenuButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
      
      {/* Footer Info */}
      <div className="px-4 py-2 bg-gray-50/30 dark:bg-black/20 text-[10px] font-bold text-gray-400 dark:text-gray-600 flex justify-between items-center border-t border-gray-100 dark:border-gray-900/50">
        <span className="uppercase tracking-widest text-[8px]">Tiptap Rich-Text Editor</span>
        <span>{editor.storage.characterCount?.characters?.() || 0} characters</span>
      </div>
    </div>
  );
}
