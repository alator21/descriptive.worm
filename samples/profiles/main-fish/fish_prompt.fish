function fish_prompt --description 'Write out the prompt'
    # Save our status
    set -l last_pipestatus $pipestatus


    echo -n -s (set_color red)(prompt_hostname) (set_color yellow)'|' (set_color white) (prompt_pwd) (set_color brgreen) ' $' \
        (__fish_print_pipestatus " [" "]" "|" (set_color $fish_color_status) (set_color --bold $fish_color_status) $last_pipestatus) \
        (set_color normal) ' '
end
