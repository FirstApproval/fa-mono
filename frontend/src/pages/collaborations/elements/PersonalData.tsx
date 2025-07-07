import { HeightElement } from "../../common.styled"
import { Box, Button, Link, TextField, Typography } from "@mui/material"
import React from "react"

export const personalData = (props: {handlePublicationFormMsg: () => void}) => {
  const { handlePublicationFormMsg } = props;
  return (
    <>
      Awesome! Please verify the spelling of your name and affiliation, as
      this information will be used in the agreement.
      <HeightElement value={'2rem'} />
      <Box
        component="form"
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid #dedede',
          maxWidth: '600px',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
        <Box sx={{
          display: 'flex',
          gap: 2
        }}>
          <TextField fullWidth label="First name" variant="outlined" />
          <TextField fullWidth label="Last name" variant="outlined" />
        </Box>

        <TextField fullWidth label="Organization name" variant="outlined" />

        <TextField fullWidth label="Department (opt.)" variant="outlined" />

        <Box sx={{
          display: 'flex',
          gap: 2
        }}>
          <TextField
            label="Address (opt.)"
            variant="outlined"
            sx={{ flex: 7 }} // 80%
          />
          <TextField
            label="Postal code (opt.)"
            variant="outlined"
            sx={{ flex: 3 }} // 20%
          />
        </Box>

        <Link href="#" underline="hover" variant="body2">
          + Add affiliation
        </Link>

        <Box sx={{
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Button onClick={handlePublicationFormMsg} variant="outlined">
            I confirm that provided info is real
          </Button>
          <Typography component={Link} href="#" variant="body2">
            Back
          </Typography>
        </Box>
      </Box>
    </>
  );
}
