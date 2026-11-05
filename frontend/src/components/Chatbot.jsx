import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Bot, Send, X } from 'lucide-react'

const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL || 'http://localhost:5000'

const STARTERS = [
  'What are the symptoms of anemia?',
  'How can I manage high blood pressure?',
  'When should I see a doctor for a fever?',
]

const Chatbot = () => {
  const [open, setOpen] = useState(false)
  // Greeting nudge + unread badge: shown on every fresh load/refresh until the chat is opened.
  const [showNudge, setShowNudge] = useState(false)
  const [unread, setUnread] = useState(1)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, loading, open])

  // Pop a small greeting shortly after the page loads so the assistant is discoverable.
  useEffect(() => {
    const show = setTimeout(() => setShowNudge(true), 1200)
    const hide = setTimeout(() => setShowNudge(false), 10000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  const toggleOpen = () => {
    setOpen((o) => !o)
    setShowNudge(false)
    setUnread(0)
  }

  const send = async (text) => {
    const question = text.trim()
    if (!question || loading) return

    const history = messages.map(({ role, content }) => ({ role, content }))
    setMessages((m) => [...m, { role: 'user', content: question }])
    setInput('')
    setLoading(true)

    try {
      const { data } = await axios.post(`${CHATBOT_URL}/api/chat`, { message: question, history })
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: data.answer, sources: data.sources, emergency: data.emergency },
      ])
    } catch (error) {
      const message = error.response?.data?.message || 'The assistant is unavailable. Please try again shortly.'
      setMessages((m) => [...m, { role: 'assistant', content: message, error: true }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      {open && (
        <div
          role='dialog'
          aria-label='PharmLink assistant'
          className='mb-3 flex h-[28rem] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-xl dark:border-gray-700 dark:bg-[#171a23]'
        >
          <div className='flex items-center justify-between bg-primary px-4 py-3 text-white'>
            <div>
              <p className='font-medium'>PharmLink assistant</p>
              <p className='text-xs text-white/80'>Answers come from verified medical documents</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label='Close assistant'
              className='rounded p-1 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white'
            >
              <X size={18} />
            </button>
          </div>

          <div className='flex-1 space-y-3 overflow-y-auto px-3 py-3 text-sm' aria-live='polite'>
            {messages.length === 0 && (
              <div className='space-y-2'>
                <p className='text-gray-600'>Ask a health question. Try one of these:</p>
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className='block w-full rounded border border-primary/40 px-3 py-2 text-left text-primary hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    'max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 ' +
                    (m.role === 'user'
                      ? 'bg-primary text-white'
                      : m.emergency || m.error
                      ? 'border border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-[#2c1618] dark:text-red-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-[#222735] dark:text-gray-100')
                  }
                >
                  {m.content}
                  {m.sources?.length > 0 && (
                    <p className='mt-2 border-t border-gray-300 pt-1 text-xs text-gray-500'>
                      Source: {m.sources.map((s) => (s.page ? `${s.source}, p. ${s.page}` : s.source)).join('; ')}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && <p className='text-gray-500'>Looking through the medical documents…</p>}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className='border-t border-gray-300 p-2'
          >
            <div className='flex items-center gap-2'>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                placeholder='Type your question'
                aria-label='Your question'
                className='flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              />
              <button
                type='submit'
                disabled={loading || !input.trim()}
                aria-label='Send question'
                className='rounded bg-primary p-2 text-white disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
              >
                <Send size={18} />
              </button>
            </div>
            <p className='mt-1 px-1 text-[11px] text-gray-500'>
              General information only, not a diagnosis. In an emergency call 112.
            </p>
          </form>
        </div>
      )}

      {/* Greeting nudge */}
      {!open && showNudge && (
        <div className='mb-3 ml-auto flex max-w-[16rem] items-start gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-lg dark:border-gray-700 dark:bg-[#171a23] dark:text-gray-200'>
          <button onClick={toggleOpen} className='text-left focus:outline-none'>
            <span className='font-medium text-primary'>Hi! I&apos;m your health assistant 👋</span>
            <span className='block text-xs text-gray-500'>Ask me about symptoms, first aid or care.</span>
          </button>
          <button
            onClick={() => setShowNudge(false)}
            aria-label='Dismiss'
            className='rounded p-0.5 text-gray-400 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Launcher: labelled pill with AI badge, online dot and unread count */}
      <button
        onClick={toggleOpen}
        aria-label={open ? 'Close assistant' : 'Open health assistant chat'}
        aria-expanded={open}
        className='relative ml-auto flex items-center gap-2 rounded-full bg-primary py-2.5 pl-3 pr-4 text-white shadow-lg transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
      >
        {open ? <X size={20} /> : <Bot size={22} />}
        <span className='text-sm font-medium'>{open ? 'Close' : 'Ask AI'}</span>
        {!open && (
          <span className='rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide'>AI</span>
        )}
        {!open && (
          <span className='absolute -left-0.5 -top-0.5 flex h-3 w-3' aria-hidden='true'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75' />
            <span className='relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-green-500' />
          </span>
        )}
        {!open && unread > 0 && (
          <span
            className='absolute -right-1 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white'
            aria-label={`${unread} new message`}
          >
            {unread}
          </span>
        )}
      </button>
    </div>
  )
}

export default Chatbot
