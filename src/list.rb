$replacements = {

	/\n/                => ->            { '<br />' },
	/^# (.+)/           => -> text       { "<h1>#{text}</h1>" },
	/^## (.+)/          => -> text       { "<h2>#{text}</h2>" },
	/^### (.+)/         => -> text       { "<h3>#{text}</h3>" },
	/\[(\w+)\]\((.+)\)/ => -> text, link { %Q{<a href="#{link}">#{text}</a>} }

}

def parse_list(string)

	string.strip!

	return '' if string.empty?

	string.gsub!(/((?:^[^\t].*\n?)+)((?:^\t.*\n?)*)/) {

		nontabbed, tabbed = $1.strip, $2

		items = []

		nontabbed.gsub!(/((?:^- .+\n?)(?:^  .+\n?)*)/) {

			items.push parse_content $1.gsub(/^../, '')

			''

		}

		next '' if items.empty? # filler instead?

		sublist = parse_list tabbed.gsub(/^\t/, '')
		items[-1] += sublist if not sublist.empty?

		items.map{|item| "<li>#{item}</li>"}.join ''

	}

	"<ul>#{string}</ul>"

end

def parse_content(string)

	$replacements.each do |pattern, replacement|

		string.gsub!(pattern) { replacement.call(*$~.captures) }


	end

	string

end

print parse_list ARGF.read