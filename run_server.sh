cd "$(dirname "$0")"
export RUBYOPT="-r $(pwd)/_plugins/ruby4_compat.rb"
bundle exec jekyll liveserve