module Jekyll
  class MarkdownTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @text = text.strip
    end
    require "redcarpet"
    def render(context)
			text = File.read(File.join(Dir.pwd, '_includes', @text))
      #text ="asdasdasd"

			renderer ||= Class.new(Redcarpet::Render::HTML) do
        def block_code(code, lang)
          lang = lang && lang.split.first || "text"
          output = '<pre><code class="language-' + lang + '">' + code + '</code></pre>'
        end
      end

			markdown = Redcarpet::Markdown.new(renderer,
				:no_intra_emphasis => true,
				:tables => true,
				:fenced_code_blocks => true,
				:autolink => true,
				:disable_indented_code_blocks => false,
				:strikethrough => true,
				:lax_spacing => true,
				:space_after_headers => false,
				:superscript => false,
				:underline => false,
				:highlight => false)
			markdown.render(text)
      #}"#{Redcarpet::Markdown.new(File.read(File.join(Dir.pwd, '_includes', @text))).to_html}"
    end
  end
end
Liquid::Template.register_tag('markdown', Jekyll::MarkdownTag)
