"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import { useOne, useUpdate, useGetIdentity, CanAccess } from "@refinedev/core";
import resources from "@/resources";

const MAX_SELECTION = 6;

export default function QuickAccessSettings() {
  const { data: userIdentity } = useGetIdentity<{ id: string }>();
  const { mutate: updateProfile, isLoading: saving } = useUpdate();
  
  const { data: userData, isLoading } = useOne({
    resource: "profiles",
    id: userIdentity?.id,
    meta: { select: "quick_nav" },
    queryOptions: { enabled: !!userIdentity?.id },
  });

  const initialSelection = userData?.data?.quick_nav ?? [];
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialSelection.length) {
      setSelected(initialSelection);
    }
  }, [initialSelection]);

  const handleToggle = (key: string) => {
    if (selected.includes(key)) {
      setSelected((prev) => prev.filter((k) => k !== key));
    } else if (selected.length < MAX_SELECTION) {
      setSelected((prev) => [...prev, key]);
    }
  };

  const handleSave = () => {
    if (!userIdentity?.id) return;
    updateProfile(
      {
        resource: "profiles",
        id: userIdentity.id,
        values: { quick_nav: selected },
      },
      {
        onSuccess: () => setSaved(true),
      }
    );
  };

  const selectableResources = resources.filter(
    (r) => r.meta?.label && !r.meta.hide
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select up to 6 Quick Access Buttons
      </Typography>

      <Grid container spacing={2}>
        {selectableResources.map((res) => (
            <CanAccess key={res.name} resource={res.name} action='list'>
                <Grid item xs={6} sm={4} md={3} key={res.name}>
                    <FormControlLabel
                    control={
                        <Checkbox
                        checked={selected.includes(res.name)}
                        onChange={() => handleToggle(res.name)}
                        disabled={
                            !selected.includes(res.name) && selected.length >= MAX_SELECTION
                        }
                        />
                    }
                    label={res.meta.label}
                    />
                </Grid>
          </CanAccess>
        ))}
      </Grid>

      {selected.length > MAX_SELECTION && (
        <Alert severity="error" sx={{ mt: 2 }}>
          You can only select up to {MAX_SELECTION} items.
        </Alert>
      )}

      <Box mt={3}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || selected.length === 0}
        >
          Save
        </Button>
        {saved && (
          <Typography color="success.main" mt={1}>
            Saved successfully!
          </Typography>
        )}
      </Box>
    </Box>
  );
}
