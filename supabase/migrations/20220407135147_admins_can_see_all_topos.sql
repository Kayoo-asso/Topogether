-- Added the `or is_admin()`
alter policy "Topo visibility"
    on topos
    using ( 
        -- have to explicitly write out the condition, to avoid a recursive call between the policy and the function
        status = 2 or is_contributor(id, auth.uid()) or is_admin(auth.uid())
    );