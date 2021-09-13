require 'rake'
require 'safe_yaml'
require 'fileutils'
require 'liquid'
require 'git'
require 'jekyll'
require 'asciidoctor'

SafeYAML::OPTIONS[:deserialize_symbols] = true
SafeYAML::OPTIONS[:default_mode] = :safe

@config       = YAML.load_file("_config.yml")
@upstream     = YAML.load_file('lib/asciidocsy/data/dependencies.yml')
@vendored     = @upstream.select{|d|d['vendor']}
@history      = YAML.load_file("lib/asciidocsy/data/releases.yml")
if @history['revisions'][0]['patches']
  @latest = @history['revisions'][0]['patches'][0]
else
  @latest = @history['revisions'][0]
end

desc "Build the NOTICE file"
task :write_notice do
  notice = render_liquid('lib/asciidocsy/templates/notice-file.txt', @upstream)
  File.write("NOTICE", notice)
end

desc "Check Readme data"
task :check_readme_data do
  doc = Asciidoctor.load_file('README.adoc')
  attrs = doc.attributes
  unless attrs['prod_vrsn_this'].to_s === @latest['code'].to_s
    STDERR.puts "WARN: Data mismatch: :prod_vrsn_this: in README.adoc does not match latest version in releases.yml"
  end
  unless attrs['prod_date_this'].to_s === @latest['date'].to_s
    STDERR.puts "WARN: Data mismatch: :prod_vrsn_date: in README.adoc does not match latest version in releases.yml"
  end
end

def render_liquid file=String, data=Enumerable
  template = File.read(file) # reads the template file
  template = Liquid::Template.parse(template) # compiles template
  rendered = template.render("data" => data) # renders the output
end
