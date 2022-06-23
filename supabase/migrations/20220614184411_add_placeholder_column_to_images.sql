alter type public.img add attribute placeholder text;

create function set_placeholder(_img_id UUID, _placeholder text, _holder text) returns void as $$
begin
    if _holder = 'topo' then
        update public.topos
        set image
    else if _holder = 'boulder' then

    end if;
end;
$$ language plgpsql volatile;