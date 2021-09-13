require 'optparse'
require 'safe_yaml'
require 'liquid'
require 'logger'
require 'fileutils'
require 'jekyll'

require 'zurb-foundation'
require './lib/functions'

http_path = '/'
css_dir = 'assets/css'
sass_dir = '_sass'
images_dir = 'assets/images'
javascripts_dir = 'assets/js'

# :expanded, :nested, :compact or :compressed
output_style = :compact
#output_style = :compressed

relative_assets = true

#line_comments = true
line_comments = false

# doesn't seem to work
#asset_cache_buster = false

SafeYAML::OPTIONS[:deserialize_symbols] = true
SafeYAML::OPTIONS[:default_mode] = :safe

def build_theme path
  loc_conf = YAML.load_file("_config.yml")
  loc_conf['quiet'] = true
  # loc_conf['verbose'] = true
  loc_conf['destination'] = "_tmp/local"
  local_config = Jekyll.configuration(loc_conf)
  local_site = Jekyll::Site.new(local_config)
  gem_conf = YAML.load_file(local_site.in_theme_dir + "/_config.yml")
  gem_conf['data_dir'] = local_site.in_theme_dir + "/_data"
  gem_conf['destination'] = "_tmp/prime"
  gem_conf['source'] = "./"
  # gem_conf['quiet'] = true
  gem_conf['verbose'] = true
  gem_config = Jekyll.configuration(gem_conf)
  prime_site = Jekyll::Site.new(gem_config)
  return { "prime" => prime_site , "local" => local_site }
end

def show_docs data_path
  sites = build_theme(data_path)
  puts "\nPRIME:\n"
  puts sites['prime'].data
  puts "\nLOCAL:\n"
  puts sites['local'].data
end

command_parser = OptionParser.new do|opts|
  opts.banner = "Usage: adxy [options]"

  opts.on("--docs VAR", "Show the docs for a particular config object.") do |n|
    show_docs(n)
  end

  opts.on("-h", "--help", "Returns help.") do
    puts opts
    exit
  end

end

command_parser.parse!
