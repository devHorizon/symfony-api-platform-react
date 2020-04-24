<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
// Doctrine\Common\Persistence\ObjectManager => Doctrine\ORM\EntityManagerInterface
/**
 * Class InvoiceIncrementationController
 * @package App\Controller
 */
class InvoiceIncrementationController
{
    /**
     * @var EntityManagerInterface
     */
    private $manager;
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }
    public function __invoke(Invoice $data)
    {
        $data->setChrono($data->getChrono() + 1);
        $this->manager->flush();
        // dd($data);
        return $data;
    }
}
