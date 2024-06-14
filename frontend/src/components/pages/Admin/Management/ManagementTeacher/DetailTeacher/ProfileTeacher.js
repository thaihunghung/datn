import { Button, Input, Card, Grid, Spacer, Text, Avatar, Link } from '@nextui-org/react';

const ProfilePage = () => {
  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={12} sm={6}>
        <Card>
          <Card.Header>
            <Avatar
              size="xl"
              src="https://via.placeholder.com/150"
              alt="Profile Picture"
              bordered
              color="primary"
            />
            <Spacer x={0.5} />
            <Button auto flat>Edit</Button>
          </Card.Header>
          <Card.Body>
            <Grid.Container gap={2}>
              <Grid xs={12}>
                <Button auto shadow>Connect to LinkedIn</Button>
              </Grid>
              <Grid xs={12} sm={6}>
                <Input label="First Name" placeholder="Andrew" fullWidth />
              </Grid>
              <Grid xs={12} sm={6}>
                <Input label="Last Name" placeholder="Turing" fullWidth />
              </Grid>
              <Grid xs={12} sm={6}>
                <Input label="Time Zone" placeholder="+5 GMT" fullWidth />
              </Grid>
              <Grid xs={12} sm={6}>
                <Input label="Phone" placeholder="555-237-2384" fullWidth />
              </Grid>
              <Grid xs={12}>
                <Input label="Email Address" placeholder="andrew.turing@cryptographyinc.com" fullWidth />
              </Grid>
            </Grid.Container>
            <Spacer y={1} />
            <Text h4>Authentication</Text>
            <Input label="SAML ID" placeholder="andrew.turing@cryptographyinc.com" fullWidth />
            <Spacer y={0.5} />
            <Input label="SAML Details" placeholder="https://cryptographyinc.com/login/secure/kQ28neiw99" fullWidth />
          </Card.Body>
          <Card.Footer>
            <Grid.Container justify="space-between">
              <Button auto flat color="error">×</Button>
              <Button auto flat color="success">✓</Button>
            </Grid.Container>
          </Card.Footer>
        </Card>
      </Grid>
    </Grid.Container>
  );
};

export default ProfilePage;
